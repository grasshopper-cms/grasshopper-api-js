#!/bin/sh
pm2 start           /vagrant/bin/grasshopper-api.js             \
        -i max                                                  \
        -e          /vagrant/log/grasshopper.err.log            \
        -o          /vagrant/log/grasshopper.out.log

genghisapp
