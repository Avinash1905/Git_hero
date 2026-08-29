Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = "C:\Users\HP\OneDrive\Desktop\GitHero.zip"
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)

Write-Host "Total entries in GitHero.zip: $($zip.Entries.Count)"

$required = @(
    ".git/HEAD",
    ".git/config",
    ".git/objects/",
    ".git/refs/",
    "package.json",
    "package-lock.json",
    "README.md",
    "js/app.js",
    "src/features/editor/GitQuestLevelEditor.js",
    "server/server.js",
    "tests/integration.test.js"
)

foreach ($item in $required) {
    $normalizedItem = $item.Replace('\', '/')
    $match = $zip.Entries | Where-Object { $_.FullName.Replace('\', '/') -like "*$normalizedItem*" } | Select-Object -First 1
    if ($match) {
        Write-Host "  [OK] $item -> $($match.FullName)"
    } else {
        Write-Host "  [FAIL] $item NOT FOUND"
    }
}

$zip.Dispose()

# Now extract into a temporary directory and test git commands!
$tempDir = Join-Path $env:TEMP "githero_eval_test_$(Get-Random)"
Write-Host "`nExtracting $zipPath to $tempDir..."
[System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tempDir)

Write-Host "`nRunning git verification inside extracted directory ($tempDir):"
$status = git -C $tempDir status
Write-Host "`n--- git status ---"
Write-Host ($status -join "`n")

$log = git -C $tempDir log --oneline -n 10
Write-Host "`n--- git log ---"
Write-Host ($log -join "`n")

$branches = git -C $tempDir branch -a
Write-Host "`n--- git branch -a ---"
Write-Host ($branches -join "`n")

# Clean up temp dir
Remove-Item -Path $tempDir -Recurse -Force
Write-Host "`nTemp directory cleaned up successfully."

# Now verify folder-wrapped zip archive
$folderZip = "C:\Users\HP\OneDrive\Desktop\GitHero_folder.zip"
if (Test-Path $folderZip) {
    Write-Host "`nVerifying folder-wrapped zip ($folderZip)..."
    $z2 = [System.IO.Compression.ZipFile]::OpenRead($folderZip)
    Write-Host "Total entries in GitHero_folder.zip: $($z2.Entries.Count)"
    $head = $z2.Entries | Where-Object { $_.FullName -like "*GitHero/.git/HEAD*" } | Select-Object -First 1
    if ($head) { Write-Host "  [OK] GitHero/.git/HEAD -> $($head.FullName)" }
    $pkg = $z2.Entries | Where-Object { $_.FullName -like "*GitHero/package.json*" } | Select-Object -First 1
    if ($pkg) { Write-Host "  [OK] GitHero/package.json -> $($pkg.FullName)" }
    $lock = $z2.Entries | Where-Object { $_.FullName -like "*GitHero/package-lock.json*" } | Select-Object -First 1
    if ($lock) { Write-Host "  [OK] GitHero/package-lock.json -> $($lock.FullName)" }
    $z2.Dispose()
}
