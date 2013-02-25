# This file will be compiled to .coffee/example.js
for i in [1..3]
  do (i) ->
    setTimeout ->
      console.log "hello, #{ i }"
    , 200*i
