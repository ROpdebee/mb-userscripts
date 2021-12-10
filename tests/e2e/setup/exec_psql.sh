#!/usr/bin/env bash

# For some reason we need this indirection, otherwise we get perl errors in the
# MB container.

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

echo `date` : Inserting our custom test data
OUTPUT=`./admin/psql < "$EXTRA_SQL" 2>&1` || ( echo "$OUTPUT" && exit 1 )
echo "$OUTPUT"
