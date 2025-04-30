#!/bin/bash
ssh root@coyace.top << EOF
cd repos
git clone git@github.com:CoyAce/codox.git
cd codox
hugo
rm -rf /var/www/html/doc
mv -f public /var/www/html/doc
EOF
