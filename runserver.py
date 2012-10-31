#! /usr/bin/python3

from http.server import SimpleHTTPRequestHandler,HTTPServer

httpd=HTTPServer(('',8080),SimpleHTTPRequestHandler)
httpd.serve_forever()