#!/bin/bash
ssh root@coyace.top << EOF
cd repos
git clone git@github.com:CoyAce/codox.git
cd codox
hugo
mv -f public /var/www/html/doc
EOF
