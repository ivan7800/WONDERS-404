#!/usr/bin/env python3
"""Serve this WONDERS 404 folder on an available loopback port."""
import http.server
import functools
import pathlib
import threading
import webbrowser

ROOT = pathlib.Path(__file__).resolve().parent

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

if __name__ == '__main__':
    with http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler) as server:
        address = f'http://127.0.0.1:{server.server_port}/index.html'
        print('WONDERS 404 - servidor iniciado', flush=True)
        print('ABRE ESTA DIRECCION: ' + address, flush=True)
        print('Pulsa Ctrl+C para detenerlo.', flush=True)
        threading.Timer(0.4, lambda: webbrowser.open(address)).start()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('Servidor detenido.')
