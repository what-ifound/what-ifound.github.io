$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:4173/")
$listener.Start()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart("/")

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $localPath = Join-Path $PSScriptRoot $requestPath

    if ((Test-Path $localPath) -and -not (Get-Item $localPath).PSIsContainer) {
      $bytes = [System.IO.File]::ReadAllBytes($localPath)

      switch ([System.IO.Path]::GetExtension($localPath).ToLowerInvariant()) {
        ".html" { $context.Response.ContentType = "text/html; charset=utf-8" }
        ".css" { $context.Response.ContentType = "text/css; charset=utf-8" }
        ".js" { $context.Response.ContentType = "application/javascript; charset=utf-8" }
        ".jpg" { $context.Response.ContentType = "image/jpeg" }
        ".jpeg" { $context.Response.ContentType = "image/jpeg" }
        ".png" { $context.Response.ContentType = "image/png" }
        ".webp" { $context.Response.ContentType = "image/webp" }
        default { $context.Response.ContentType = "application/octet-stream" }
      }

      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $context.Response.StatusCode = 404
      $context.Response.ContentType = "text/plain; charset=utf-8"
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }

    $context.Response.OutputStream.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
