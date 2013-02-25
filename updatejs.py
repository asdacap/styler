#! /usr/bin/python
import sys
from subprocess import call

filelists=[
           "src/copying.js",
           "src/stylerslider.js",
           "src/stylermeta.js",
           "src/colorpicker.js",
           "src/stylermain.js"
           ]
target="static/styler.js"

def compile():
    cmds=["java","-jar","compiler.jar"]
    for var in filelists:
        cmds.append("--js="+var);
    cmds.append("--js_output_file="+target)
    call(cmds)

def concat():
    texts=""
    for var in filelists:
        fh=open(var)
        texts=texts+fh.read()
    fh=open(target,"w")
    fh.write(texts)
    fh.close()

if __name__ == "__main__":
    if "compile" in sys.argv:
        compile()
    else:
        concat()
