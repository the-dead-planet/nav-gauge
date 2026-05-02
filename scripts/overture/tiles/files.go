package tiles

import (
	"archive/zip"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"overture/validator"
	"path/filepath"
	"strings"
	"time"

	"log/slog"

	_ "github.com/duckdb/duckdb-go/v2"
)

// Downloads from given url and saves as given file name
func download(urlStr, fileName string) error {
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return fmt.Errorf("invalid URL: %w", err)
	}
	if parsedURL.Scheme != "https" {
		return fmt.Errorf("invalid URL scheme %q: only https is allowed", parsedURL.Scheme)
	}
	if parsedURL.Host == "" {
		return errors.New("invalid URL: missing host")
	}

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	res, err := client.Get(parsedURL.String())
	if err != nil {
		return err
	}
	defer res.Body.Close()

	out, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, res.Body)
	return err
}

// Returns unzipped directory name
func unzip(destination string, fileName string) (string, error) {
	archive, err := zip.OpenReader(fileName)
	validator.ExitIfError(err, "unzip")
	defer archive.Close()

	var directory string
	cleanDestination := filepath.Clean(destination)
	destinationPrefix := cleanDestination + string(os.PathSeparator)

	for i, file := range archive.File {
		filePath := filepath.Clean(filepath.Join(destination, file.Name))

		if !(filePath == cleanDestination || strings.HasPrefix(filePath, destinationPrefix)) {
			return "", errors.New("invalid path")
		}
		if file.FileInfo().IsDir() {
			if i == 0 {
				directory = file.Name
				slog.Info("Directory", "fileName", fileName, "directory", directory)
			}
			err = os.MkdirAll(filePath, 0o755)
			validator.ExitIfError(err, filePath)
			continue
		}

		err = os.MkdirAll(filepath.Dir(filePath), 0o755)
		validator.ExitIfError(err, "")

		destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode()&0o777)
		validator.ExitIfError(err, filePath)

		fileInArchive, err := file.Open()
		validator.ExitIfError(err, file.Name)

		_, err = io.Copy(destinationFile, fileInArchive)
		validator.ExitIfError(err, "copy file")

		err = destinationFile.Close()
		validator.ExitIfError(err, filePath)

		fileInArchive.Close()
	}

	slog.Info("Unzipped", "directory", directory)

	return directory, nil
}
