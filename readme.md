# Log-Output Application

This repository contains the source code for the `log-output-app`, a Node.js service that aggregates and displays data from multiple sources within a Kubernetes environment.

---

## Purpose

This application serves as a frontend or aggregator. It demonstrates how a service can interact with other services, shared volumes, and ConfigMaps within a Kubernetes cluster.

It has a direct dependency on the `pingpong-app` service.

## Architecture

This application runs two containers within the same Pod:

1.  **Writer Container**: A simple script that writes the current timestamp to a shared file every 5 seconds.
2.  **Reader Container**: A Node.js (Koa) web server that, on each request, does the following:
    -   Reads the timestamp from the shared file.
    -   Reads an environment variable populated by a ConfigMap.
    -   Makes an HTTP call to the `pingpong-app` service to get the current pong count.
    -   Combines and displays all this information.

## GitOps & Deployment

This is an **Application Repository**. The Kubernetes manifests for deploying this service are managed in a separate **Configuration Repository**: `log-pong-config`.

A CI/CD pipeline is configured via GitHub Actions in this repository. When changes are pushed to the `main` branch:
1.  A new Docker image is automatically built and pushed to Docker Hub.
2.  The pipeline then automatically updates the image tag in the `log-pong-config` repository.
3.  ArgoCD detects this change and deploys the new version to the cluster.