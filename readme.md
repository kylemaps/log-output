# Log Output Application

## Overview
The **Log Output** application consists of **two containers within a single pod**:
1. **Writer** - Generates timestamps every 5 seconds and saves them to a shared file.
2. **Reader** - Reads the file, hashes the contents, and fetches the ping count from the Pingpong app.

This application was developed step by step through various exercises in **DevOps with Kubernetes**, progressively improving its architecture and deployment.

---

## 🚀 **Progression of the App**
### **Exercise 1.07: External Access with Ingress**
- Initially, the Log Output app only logged a **timestamp** and **random hash**.
- Added an **endpoint** (`/log-output`) to fetch this data.
- Exposed the app via **Ingress** for browser access.

### **Exercise 1.08: Using Ingress Instead of NodePort**
- Migrated from **NodePort** to **Ingress**.
- Removed the standalone Ingress of Log Output to make way for shared routing.

### **Exercise 1.09: Added Pingpong App**
- Introduced a **second application (Pingpong)** that increments a counter.
- Created an **Ingress rule** to share `/pingpong` with the Log Output app.

### **Exercise 1.10: Splitting Log Output into Reader & Writer**
- **Refactored the app into two containers inside one pod**:
  - **Writer** generates timestamps every 5 seconds.
  - **Reader** reads the file, computes a hash, and serves it.
- Used a **shared volume** (`emptyDir`) for data exchange.

### **Exercise 2.01: Connecting Pods via HTTP**
- Removed **shared volumes**.
- Log Output **now fetches the ping count over HTTP** from Pingpong (`http://pingpong-svc:3001/ping`).

### **Exercise 2.06: Using ConfigMaps**
- Created a **ConfigMap** to inject:
  - **A file (`information.txt`)**
  - **An environment variable (`MESSAGE=hello world`)**
- Reader now displays these in the response.

### **Exercise 3.02: Deployed to GKE with Ingress**
- Fully deployed to **Google Kubernetes Engine (GKE)**.
- Exposed the app using **GCE Ingress**.

---

## 🛠 **Setup & Deployment**
### **Build & Push Docker Images**
```sh
# Build and push the Reader container
docker build -t kylmps/log-output:latest .
docker push kylmps/log-output:latest

# Build and push the Writer container
docker build -t kylmps/log-output-writer:latest .
docker push kylmps/log-output-writer:latest
```

### **Deploy to Kubernetes**
```sh
kubectl apply -k .
```

### **Test the Application**
```sh
curl http://<EXTERNAL_IP>/log-output
```
Expected output:
```
file content: this text is from file
env variable: MESSAGE=hello world
2025-03-30T12:15:17.705Z: abcdef1234567890
Ping / Pongs: 3
```

### **Check Logs**
```sh
kubectl logs -l app=log-output -c log-output-writer
kubectl logs -l app=log-output -c log-output
```

---

## 🔥 **Learnings**
- **Ingress must return HTTP 200 at `/` for health checks.**
- **Persistent storage was replaced with HTTP communication.**
- **GKE deployments require careful networking considerations.**

🚀 **Now, the Log Output application is fully automated and cloud-deployed!**

## When applying
kubectl apply -f manifests/configmap.yaml
kubectl apply -f manifests/svc-ing.yaml
kubectl apply -f manifests/deployment.yaml

