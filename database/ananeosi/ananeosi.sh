#!/bin/bash

rm -f *.data
tar xzf data.tar.gz || exit 2

# rm -f data.tar.gz
mysql --local-infile -u prefadoros -p <ananeosi.sql
