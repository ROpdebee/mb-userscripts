#!/usr/bin/env bash

# Adapted from https://github.com/metabrainz/musicbrainz-server/blob/master/script/reset_selenium_env.sh
# However, it does more than we need, and also applies its updates to the SELENIUM
# DB. We don't use the SELENIUM DB.

set -o errexit

EXTRA_SQL="$1"

echo `date` : Terminating all PG backends
CANCEL_QUERY=$(cat <<'SQL'
SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
 WHERE usename = 'musicbrainz'
   AND query NOT LIKE '%pg_terminate_backend%';
SQL
)
OUTPUT=`echo "$CANCEL_QUERY" | ./admin/psql 2>&1` || ( echo "$OUTPUT" && exit 1 )

echo `date` : Truncating all tables
OUTPUT=`./admin/psql <./admin/sql/TruncateTables.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )
OUTPUT=`./admin/psql <./admin/sql/caa/TruncateTables.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )

echo `date` : Inserting initial test data
OUTPUT=`./admin/psql < ./t/sql/initial.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )

echo `date` : Setting sequences
OUTPUT=`./admin/psql <./admin/sql/SetSequences.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )

echo `date` : Inserting default test data
OUTPUT=`./admin/psql < ./t/sql/selenium.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )

echo `date` : Inserting our default test data
OUTPUT=`./admin/psql < /media/e2e/setup/test-data.sql 2>&1` || ( echo "$OUTPUT" && exit 1 )
