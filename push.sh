#!/bin/bash
scp -r public root@coyace.top:/tmp
ssh root@coyace.top << EOF
cd /tmp
rm -rf /var/www/html/doc
mv -f public /var/www/html/doc
EOF
