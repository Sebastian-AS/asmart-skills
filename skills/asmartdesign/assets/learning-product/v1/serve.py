"""Local presentation server with byte ranges so long WAV files seek correctly."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import re,os
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--directory',default=str(Path(__file__).resolve().parents[1]/'web'));parser.add_argument('--port',type=int,default=8777);args=parser.parse_args()
ROOT=Path(args.directory).resolve()
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def send_head(self):
  self.byte_range=None
  path=self.translate_path(self.path)
  match=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers.get('Range',''))
  if not match or not os.path.isfile(path):return super().send_head()
  size=os.path.getsize(path);start=int(match[1]);end=min(int(match[2]) if match[2] else size-1,size-1)
  if start>=size or end<start:
   self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
  f=open(path,'rb');f.seek(start);self.byte_range=(start,end)
  self.send_response(206);self.send_header('Content-Type',self.guess_type(path));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(end-start+1));self.end_headers();return f
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-cache');super().end_headers()
 def copyfile(self,source,outputfile):
  if self.byte_range is None:return super().copyfile(source,outputfile)
  remaining=self.byte_range[1]-self.byte_range[0]+1
  while remaining:
   chunk=source.read(min(1024*1024,remaining))
   if not chunk:break
   outputfile.write(chunk);remaining-=len(chunk)
 def log_message(self,*args):pass
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
