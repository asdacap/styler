#! /usr/bin/python

filelists=[
           "src/copying.js",
           "src/stylerslider.js",
           "src/stylermeta.js",
           "src/colorpicker.js",
           "src/stylermain.js"
           ]
target="static/styler.js"

def compile():
    texts=""
    for var in filelists:
	fh=open(var)
        texts=texts+fh.read()
    fh=open(target,"w")
    fh.write(texts)
    fh.close()

if __name__ == "__main__":
    compile()
