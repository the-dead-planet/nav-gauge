# Intro

This program downloads defined overture data using duckdb and creates pmtiles using tippecanoe.

## Links

https://docs.overturemaps.org/getting-data/duckdb
https://github.com/felt/tippecanoe
https://docs.protomaps.com/pmtiles/create

## Run

### Required OS
The script will not run on Windows due to the use of cgo by DuckDB drivers. 

### Command
On a unix-like system run below commands which will generate `roads.pmtiles`. Move the file where desired.

```
go get
go run .
```
