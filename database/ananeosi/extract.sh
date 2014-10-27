#!/usr/bin/env bash

data_files="pektis.data peparam.data profinfo.data sxesi.data isfora.data"

rm -f ${data_files}
sed "s;__DIR__;`pwd`;" extract.sql | mysql -u prefadoros -p || exit 2

tar czf data.gz ${data_files}
rm -f ${data_files}
