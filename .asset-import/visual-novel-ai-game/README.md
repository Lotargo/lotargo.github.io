# Visual Novel article asset import

This staging directory exists only for importing the binary assets and the updated article in one atomic operation.

## Import

1. Upload a file named `bundle.b64` into this directory.
2. The `Import article assets` GitHub Actions workflow starts automatically.
3. The workflow decodes the archive, writes the real AVIF/WebP/PNG files to their article asset directory, updates the article and shared gallery code, and removes this staging directory.

The base64 file is only a transport envelope for GitHub tooling that cannot write binary files directly. It is not used by the published site and is deleted after a successful import.
