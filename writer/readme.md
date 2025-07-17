So i split the main app to two containers it was a mistake that i am now just fixed. I will build this app using:
1) i then ran `docker build -t kylmps/log-output-writer:1.0 .`
2) then `docker push kylmps/log-output-writer:1.0`
3) then `kubectl apply -f manifests/`

note: when i want to build with no cache `docker build --no-cache -t kylmps/log-output:1.0 .`

