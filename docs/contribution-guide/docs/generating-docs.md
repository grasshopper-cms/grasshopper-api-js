# Generating Docs

The Grasshopper documentation is built with [mkdocs](http://www.mkdocs.org/). 
Mkdocs is a simple way to use markdown to build docs.

To add to the docs you have to:

1. Install mkdocs:
 
    ```
    pip install mkdocs
    ``` 
    
    (You will need [python](http://docs.python-guide.org/en/latest/starting/install/osx/)
     and pip. Pip can be installed with `sudo easy_install pip`)
    
1. `mkdocs serve`
1. Open [http://localhost:8000](http://localhost:8000)
1. Start editing the files in the `docs/` dir and `mkdocs.yml` in the project root.
 
The idea behind using mkdocs is that it is flexible and easy to use. We've
tried jsdoc, apidoc, docco and other inline documentation. The problem
with those is that they tend to make the code harder to read, and that
you end up with very well documentated methods with no overall context.

These docs are meant to be like a guide with specific examples and pointers
to the code.

To add a new page to the docs, looks at `mkdocs.yml`.
