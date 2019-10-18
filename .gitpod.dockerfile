FROM gitpod/workspace-full

RUN sudo apt-get update
RUN sudo mkdir -m 0755 /nix && chown gitpod /nix
RUN sudo git lfs install
RUN sudo git lfs pull
RUN make build
RUN make test