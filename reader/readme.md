hi so this is what i did

1) created a repo sa github https://github.com/kylemaps/log-output (based on the name sa exercise as suggested)
2) git init sa folder ng ni copy ko na base template for the app (that's app2 for u)
3) git push to https://github.com/kylemaps/log-output
4) i then ran `docker build -t kylmps/log-output:1.0 .` I remembered bakay kaya di natatag kasi nga nauuba ko i create bago itag
5) then `docker push kylmps/log-output:1.0`
6) then `kubectl create deployment log-output-dep --image=kylmps/log-output:1.0`
7) then `kubectl get pods`
8) checked logs if it is working `kubectl logs -f log-output-dep-6b9d65bbcd-8v4p4`


this has become the writer file Exercise 1.10: Even more services

there will also be one deployment.yaml for app2-log-output and app2-pingpong


'NOTE': i spent about a day and a half trying to figure out how to make this work:
problems encountered:
1) Crashing containers, BackOff something error
 - Solution: Just kubectl delete and reapply (theory is lack of cpu or corrupt image)
2) App not functioning even if added so many layers of logging mechanisms (pingpong index.js)
 - Solution: Increment the tag (theory baka caching issues daw sabi ni cgpt it worked after i increment)
3) Learned about this too: kubectl run curl-test --rm -i --tty --image=curlimages/curl -- sh
 curl http://log-output-svc:2345/log-output-svc
~ $  curl http://hashresponse-svc:2345/hashresponse-svc
~ $  curl http://log-output-svc:2345/log-output-svc
4) Connect the "Log output" application and "Ping-pong" application. Instead of sharing data via files use HTTP endpoints to respond with the number of pongs. Deprecate all the volume between the two applications for the time being.

The output will stay the same:

2020-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43.
Ping / Pongs: 3

so i have two endpoinst for this exercise one /ping (increments and then fetched by log-output app) /log-output (this one outputs the above example)


today i understand more about the networking of client -> ingress -> service -> pods -> containers and vice versa.

so as of Exercise 2.01: Connecting pods from devopswithkubernetes.com --> basically i connect to the app via ingress (localhost:8081/log-output) then that path leads to service in port 3001 then from the service it receives from port 3001 it routes it to the target port 3001 with the matching label of app: log-output then from the pod it targets the port 3001. THen it reaches my log-output app then from my log-output app it sends a request GET to localhost:3002/ping then the pingpong app process it and then the log-output gets the ping count and returns a body.

Client
  |
  v
+--------------------------------------+
| Ingress: log-output-ingress          | <- Ingress Controller
| +----------------------------------+ |
| | Path: /log-output                | |
| |  - Service: log-output-svc       | |
| |  - Port: 3002                    | |
| +----------------------------------+ |
|            (route to service)        |
+--------------------------------------+
               |
               v
+--------------------------------------+
| Service: log-output-svc               |
| +---------------------+ +------------+|
| | Port 3002 ->        | | Pod        ||
| | targetPort 3002     | | log-output ||
| | (log-output)        | | 3002       ||
| +---------------------+ |            ||
|                         | +---------+||
|                         | | Requests||
|                         | | /ping   |||
|                         | | (local) |||
|                         | +---------+||
|                         |   to       ||
|                         |   Port     ||
|                         |  3001      ||
| +---------------------+ +------------+|
| | Port 3001 ->        | |            ||
| | targetPort 3001     | | pingpong   ||
| | (pingpong)          | | 3001       ||
| +---------------------+ +------------+|
|            (route to pods)            |
+--------------------------------------+

Client
  |
  v
+--------------------------------------+
| Ingress: log-output-ingress          | <- Ingress Controller
| +----------------------------------+ |
| | Path: /log-output                | |
| |  - Service: log-output-svc       | |
| |  - Port: 3002                    | |
| +----------------------------------+ |
|            (route to service)        |
+--------------------------------------+
               |
               v
+--------------------------------------+
| Service: log-output-svc               |
| +---------------------+ +------------+|
| | Port 3002 ->        | | Pod        ||
| | targetPort 3002     | | log-output ||
| | (log-output)        | | 3002       ||
| +---------------------+ |            ||
|                         | +---------+||
|                         | | Requests||
|                         | | /ping   |||
|                         | | (local) |||
|                         | +---------+||
|                         |   to       ||
|                         |   Port     ||
|                         |  3001      ||
| +---------------------+ +------------+|
| | Port 3001 ->        | |            ||
| | targetPort 3001     | | pingpong   ||
| | (pingpong)          | | 3001       ||
| +---------------------+ +------------+|
|            (route to pods)            |
+--------------------------------------+

                       +------------------------+
                       |        Pod             |
                       | +--------------------+ |
   +---------------+   | | Container:         | |
   | Service:      |   | | log-output         | |
   | log-output-svc|---| | Port: 3002         | |
   +-------+-------+   | +--------------------+ |
           |           | +--------------------+ |
           |           | | Container:         | |
           |           | | pingpong           | |
           |           | | Port: 3001         | |
           |           | +--------------------+ |
           |           +------------------------+
           |
           +-----------------------------------------------+
           | External Clients                              |
           | http://log-output-svc:3002 -> log-output:3002 |
           | http://log-output-svc:3001 -> pingpong:3001   |
           +-----------------------------------------------+
