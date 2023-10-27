#!/bin/bash

git log --pretty=format:"- **%h** (%ad) %s" --date=short > CHANGELOG.md
