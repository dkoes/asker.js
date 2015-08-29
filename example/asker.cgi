#!/usr/bin/env python

'''Server cgi script for handling asker.js  requests.
Must be passed a question id.  If an answer is also provided, inserts it.
Returns all the answer counts for this question id.

This script assumes the existence of an asker mysql database on the server.
'''

import sys, MySQLdb, json, cgi

form = cgi.FieldStorage()

print "Content-Type: text/json"     # HTML is following
print                               # blank line, end of headers

conn = MySQLdb.connect (host = "localhost",user = "asker",db="asker")
cursor = conn.cursor()
id = form.getvalue("id")
if not id:
    print "{}"
    sys.exit(1)
    
if form.getvalue("ans"):
    ans = form.getvalue("ans")
    cursor.execute("INSERT INTO answers (id,ans,cnt) VALUES (%s,%s,1) ON DUPLICATE KEY UPDATE cnt=cnt+1;", (id,ans))
    conn.commit()
    
res = {}
cursor.execute("SELECT ans,cnt FROM answers WHERE id LIKE %s", (id,))
rows = cursor.fetchall()
#convert counts into json object
for row in rows:
    res[row[0]] = row[1]
print json.dumps(res)

    
