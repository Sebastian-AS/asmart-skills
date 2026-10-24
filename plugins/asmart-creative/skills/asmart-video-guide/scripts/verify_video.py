#!/usr/bin/env python3
"""Verify rendered media metadata, separately from content and visual review."""
import argparse
from fractions import Fraction
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys


def inspect(path, expected=None, tolerance=0.5):
    ffprobe = shutil.which('ffprobe')
    if not ffprobe:
        raise RuntimeError('ffprobe is unavailable; select an available media inspector.')
    result = subprocess.run([ffprobe, '-v', 'error', '-show_format', '-show_streams',
                             '-of', 'json', str(path)], capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError('Cannot read media: ' + result.stderr.strip())
    data = json.loads(result.stdout)
    streams = data.get('streams', [])
    videos = [s for s in streams if s.get('codec_type') == 'video']
    video = videos[0] if videos else {}
    seconds = float(data.get('format', {}).get('duration', 0))
    width, height = video.get('width', 0), video.get('height', 0)
    try:
        fps = float(Fraction(video.get('avg_frame_rate') or video.get('r_frame_rate', '0/1')))
    except (ValueError, ZeroDivisionError):
        fps = 0
    errors = []
    if not videos:
        errors.append('No video stream.')
    if not math.isfinite(seconds) or seconds <= 0:
        errors.append('Duration must be positive and finite.')
    if width <= 0 or height <= 0 or fps <= 0:
        errors.append('Missing dimensions or positive frame rate.')
    if expected is not None and abs(seconds - expected) > tolerance:
        errors.append('Duration differs from target beyond tolerance.')
    return {'file': str(path.resolve()), 'duration_seconds': seconds, 'width': width,
            'height': height, 'fps': fps, 'video_codec': video.get('codec_name'),
            'pixel_format': video.get('pix_fmt'), 'bytes': path.stat().st_size,
            'has_audio': any(s.get('codec_type') == 'audio' for s in streams),
            'metadata_checks_passed': not errors, 'errors': errors,
            'scope': 'Metadata only. Content, visual, privacy and auditory review are separate.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--expected-duration', type=float)
    parser.add_argument('--tolerance', type=float, default=0.5)
    args = parser.parse_args()
    if not math.isfinite(args.tolerance) or args.tolerance < 0:
        parser.error('tolerance must be finite and non-negative')
    if args.expected_duration is not None and (not math.isfinite(args.expected_duration) or args.expected_duration <= 0):
        parser.error('expected-duration must be positive and finite')
    try:
        report = inspect(args.video, args.expected_duration, args.tolerance)
    except (OSError, ValueError, RuntimeError) as exc:
        print(str(exc), file=sys.stderr)
        return 2
    text = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text + '\n')
    print(text)
    return 0 if report['metadata_checks_passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
