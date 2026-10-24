#!/usr/bin/env python3
"""Install the ASmart course skill bundle and pinned public specialists.

Standard library + Git only. No credentials, system package installs or paid calls.
"""
from pathlib import Path
import argparse, hashlib, json, os, re, shutil, subprocess, sys, tempfile

ROOT = Path(__file__).resolve().parents[1]
IGNORED = {'__pycache__', '.git', '.DS_Store'}

def files(folder):
    return {str(p.relative_to(folder)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(folder.rglob('*')) if p.is_file()
            and not any(x in IGNORED for x in p.relative_to(folder).parts)}

def run(args):
    p = subprocess.run(args, text=True, capture_output=True)
    if p.returncode:
        raise RuntimeError(p.stderr.strip() or p.stdout.strip() or 'Command failed')
    return p.stdout.strip()

def tool_status():
    out = {'python': sys.version.split()[0]}
    for name in ['git', 'node', 'npm', 'ffmpeg', 'whisper-cli']:
        out[name] = bool(shutil.which(name))
    out['node_supported'] = False
    if out['node']:
        version = run(['node', '--version'])
        out['node_version'] = version
        out['node_supported'] = int(version.lstrip('v').split('.')[0]) >= 22
    out['scope'] = 'Presence/basic version only; Kokoro/Whisper models, TTS and perceptual audio need their own checks.'
    return out

def safe_source(base, relative):
    p = base / relative
    if Path(relative).is_absolute() or '..' in Path(relative).parts:
        raise ValueError('Invalid skill source path')
    for f in p.rglob('*'):
        if f.is_symlink():
            raise ValueError('Source contains a symlink; resolve portability before installing: ' + str(f.relative_to(base)))
    if not (p/'SKILL.md').is_file():
        raise ValueError('Missing skill entry: ' + relative)
    return p

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', type=Path, help='Bundle skills/ directory; otherwise discover bundle or retained cache')
    parser.add_argument('--destination', type=Path, default=Path(os.environ.get('CODEX_HOME', str(Path.home()/'.codex')))/'skills')
    parser.add_argument('--check', action='store_true', help='Inspect existing installation, without downloads or writes')
    parser.add_argument('--only-bundled', action='store_true', help='Offline subset, not a complete installation')
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    lock = json.loads((ROOT/'dependencies.lock.json').read_text(encoding='utf-8'))
    dest = args.destination.expanduser().resolve()
    if args.source_root:
        source_root = args.source_root.resolve()
    else:
        candidates = [ROOT.parent, ROOT.parent.parent/'.asmart-course-authoring'/lock['release']/'skills', dest.parent/'.asmart-course-authoring'/lock['release']/'skills']
        source_root = next((p for p in candidates if (p.parent/'bundle-manifest.json').is_file()), ROOT.parent)
    report = {'release': lock['release'], 'destination': str(dest), 'tools': tool_status(), 'skills': [], 'complete': False}
    selected = [d for d in lock['skills'] if not args.only_bundled or d['source']['kind']=='bundle']
    try:
        if args.check:
            for d in selected:
                present = (dest/d['name']/'SKILL.md').is_file()
                report['skills'].append({'name':d['name'], 'status':'present-unverified' if present else 'missing'})
            report['status'] = 'inventory-only; no integrity or production readiness claim'
            return report, 0 if all(x['status']=='present-unverified' for x in report['skills']) else 1, args.report
        manifest_path = source_root.parent/'bundle-manifest.json'
        if not manifest_path.is_file():
            raise ValueError('Use the full distribution bundle; bundle-manifest.json is missing. A standalone SKILL.md is insufficient.')
        manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
        actual = {str(p.relative_to(source_root.parent)) for p in source_root.rglob('*')
                  if p.is_file() and not any(x in IGNORED for x in p.relative_to(source_root).parts)}
        if actual != set(manifest['files']):
            raise ValueError('Bundle inventory differs from manifest; extra or missing skill files')
        for relative, expected in manifest['files'].items():
            p = source_root.parent/relative
            if Path(relative).is_absolute() or '..' in Path(relative).parts or not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
                raise ValueError('Bundle integrity failure: '+relative)
        if not shutil.which('git') and any(d['source']['kind']=='github' for d in selected):
            raise ValueError('Git is required for pinned public dependencies')
        with tempfile.TemporaryDirectory(prefix='asmart-skills-') as temp:
            staging = Path(temp); sources = {}; repos = {}
            for d in selected:
                name, src = d['name'], d['source']
                if not re.fullmatch(r'[a-z0-9-]+', name):
                    raise ValueError('Invalid skill name')
                if src['kind']=='bundle':
                    sources[name] = safe_source(source_root, src['path'])
                elif src['kind']=='github':
                    url, ref = src['url'], src['ref']
                    if not re.fullmatch(r'https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+\.git', url) or not re.fullmatch(r'[a-f0-9]{40}', ref):
                        raise ValueError('Dependency requires a GitHub URL and immutable commit')
                    key = (url, ref)
                    if key not in repos:
                        repo = staging/('repo-'+str(len(repos))); repo.mkdir()
                        run(['git','init','--quiet',str(repo)])
                        run(['git','-C',str(repo),'remote','add','origin',url])
                        run(['git','-C',str(repo),'config','remote.origin.promisor','true'])
                        run(['git','-C',str(repo),'config','remote.origin.partialclonefilter','blob:none'])
                        print('Fetching pinned skill source: '+url, file=sys.stderr, flush=True)
                        run(['git','-C',str(repo),'fetch','--quiet','--depth=1','--filter=blob:none','origin',ref])
                        if run(['git','-C',str(repo),'rev-parse','FETCH_HEAD'])!=ref:
                            raise ValueError('Fetched commit mismatch')
                        repos[key] = repo
                    repo = repos[key]
                    if Path(src['path']).is_absolute() or '..' in Path(src['path']).parts:
                        raise ValueError('Invalid repository subpath')
                    run(['git','-C',str(repo),'checkout','FETCH_HEAD','--',src['path']])
                    sources[name] = safe_source(repo, src['path'])
                    for license_name in ['LICENSE','LICENSE.md','LICENSE.txt']:
                        if run(['git','-C',str(repo),'ls-tree','--name-only','FETCH_HEAD',license_name]):
                            run(['git','-C',str(repo),'checkout','FETCH_HEAD','--',license_name])
                            shutil.copy2(repo/license_name,sources[name]/('UPSTREAM-'+license_name))
                            break
                    if d.get('patch')=='quote-description':
                        p = sources[name]/'SKILL.md'; lines = p.read_text(encoding='utf-8').splitlines()
                        for i, line in enumerate(lines):
                            if line.startswith('description: ') and line[13:14] not in ['"', "'"]:
                                lines[i] = 'description: '+json.dumps(line[13:],ensure_ascii=False)
                        p.write_text('\n'.join(lines)+'\n',encoding='utf-8')
                else:
                    raise ValueError('Unknown dependency source')
            # Detect all conflicts before installing any skill.
            conflicts = [name for name, source in sources.items()
                         if (dest/name).exists() and files(dest/name)!=files(source)]
            if conflicts:
                raise ValueError('Existing skills differ; preserved without overwrite: '+', '.join(conflicts))
            # Preserve a complete trusted source so the installed entry can repair dependencies.
            cache = dest.parent/'.asmart-course-authoring'/lock['release']
            if source_root.parent.resolve()!=cache.resolve():
                if cache.exists():
                    expected = dict(manifest['files'])
                    present = {str(p.relative_to(cache)):hashlib.sha256(p.read_bytes()).hexdigest()
                               for p in (cache/'skills').rglob('*') if p.is_file()
                               and not any(x in IGNORED for x in p.relative_to(cache).parts)}
                    if present!=expected:
                        raise ValueError('Retained bundle cache differs; use a new release or review it before replacing')
                else:
                    cache.mkdir(parents=True)
                    for relative in manifest['files']:
                        target = cache/relative; target.parent.mkdir(parents=True,exist_ok=True)
                        shutil.copy2(source_root.parent/relative,target)
                    shutil.copy2(manifest_path,cache/'bundle-manifest.json')
            report['bundle_cache'] = str(cache)
            dest.mkdir(parents=True, exist_ok=True)
            for d in selected:
                name = d['name']; target = dest/name; source = sources[name]
                status = 'unchanged'
                if not target.exists():
                    shutil.copytree(source,target,ignore=shutil.ignore_patterns(*IGNORED))
                    status = 'installed'
                report['skills'].append({'name':name,'status':status,'source':d['source'],'files_sha256':files(target)})
        report['complete'] = not args.only_bundled
        report['status'] = 'skills-installed; runtime and course production not certified' if report['complete'] else 'bundled-subset-only'
        return report, 0, args.report
    except (OSError, ValueError, RuntimeError) as e:
        report['error'] = str(e)
        report['status'] = 'failed; no readiness claim'
        return report, 1, args.report

if __name__=='__main__':
    report, code, report_path = main()
    if report_path:
        p = report_path; p.parent.mkdir(parents=True,exist_ok=True)
        p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'status':report['status'],'complete':report['complete'],'skills':len(report['skills']),'error':report.get('error')},ensure_ascii=False))
    raise SystemExit(code)
