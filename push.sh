#!/bin/bash
hugo
tar -czf public.tar.gz ./public
scp -r public.tar.gz root@coyace.top:/tmp
rm -f public.tar.gz
ssh root@coyace.top << EOF
cd /tmp
tar -xzf public.tar.gz
rm -f public.tar.gz
rm -rf /var/www/html/doc
mv -f public /var/www/html/doc
EOF
