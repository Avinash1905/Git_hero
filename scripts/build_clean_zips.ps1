param(
    [string]$Source = "c:\Users\HP\OneDrive\Desktop\task-2\Git_hero"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$stagingDirect = "C:\Users\HP\AppData\Local\Temp\githero_staging_direct"
$stagingFolder = "C:\Users\HP\AppData\Local\Temp\githero_staging_folder"

if (Test-Path $stagingDirect) { Remove-Item $stagingDirect -Recurse -Force }
if (Test-Path $stagingFolder) { Remove-Item $stagingFolder -Recurse -Force }

New-Item -ItemType Directory -Path $stagingDirect -Force | Out-Null
$gitHeroSubdir = Join-Path $stagingFolder "GitHero"
New-Item -ItemType Directory -Path $gitHeroSubdir -Force | Out-Null

Write-Host "Staging tracked files..."
$trackedFiles = (git -C $Source ls-files) -split "`r?`n" | Where-Object { $_ -ne "" }

foreach ($f in $trackedFiles) {
    $srcFile = Join-Path $Source $f
    if (Test-Path $srcFile) {
        # Direct staging
        $dest1 = Join-Path $stagingDirect $f
        $destDir1 = Split-Path $dest1 -Parent
        if (-not (Test-Path $destDir1)) { New-Item -ItemType Directory -Path $destDir1 -Force | Out-Null }
        Copy-Item -Path $srcFile -Destination $dest1 -Force

        # Folder staging
        $dest2 = Join-Path $gitHeroSubdir $f
        $destDir2 = Split-Path $dest2 -Parent
        if (-not (Test-Path $destDir2)) { New-Item -ItemType Directory -Path $destDir2 -Force | Out-Null }
        Copy-Item -Path $srcFile -Destination $dest2 -Force
    }
}

Write-Host "Staging .git repository directory..."
$gitDir = Join-Path $Source ".git"
$destGitDirect = Join-Path $stagingDirect ".git"
$destGitFolder = Join-Path $gitHeroSubdir ".git"

Copy-Item -Path $gitDir -Destination $destGitDirect -Recurse -Force
Copy-Item -Path $gitDir -Destination $destGitFolder -Recurse -Force

Write-Host "Creating ZIP archives using [System.IO.Compression.ZipFile]..."

$zipDesktopDirect = "C:\Users\HP\OneDrive\Desktop\GitHero.zip"
$zipDesktopFolder = "C:\Users\HP\OneDrive\Desktop\GitHero_folder.zip"
$zipLegacy = "C:\Users\HP\OneDrive\Desktop\githero.zip"
$zipLocal = Join-Path $Source "GitHero.zip"

if (Test-Path $zipDesktopDirect) { Remove-Item $zipDesktopDirect -Force }
if (Test-Path $zipDesktopFolder) { Remove-Item $zipDesktopFolder -Force }
if (Test-Path $zipLegacy) { Remove-Item $zipLegacy -Force }
if (Test-Path $zipLocal) { Remove-Item $zipLocal -Force }

# 1. Create Direct ZIP (where .git is at root of archive)
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDirect, $zipDesktopDirect)
Copy-Item $zipDesktopDirect $zipLegacy -Force
Copy-Item $zipDesktopDirect $zipLocal -Force

# 2. Create Folder ZIP (where GitHero/ is enclosing folder)
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingFolder, $zipDesktopFolder)

Write-Host "Cleaning up staging directories..."
Remove-Item $stagingDirect -Recurse -Force
Remove-Item $stagingFolder -Recurse -Force

Write-Host "Archives created successfully:"
Write-Host "  $zipDesktopDirect : $((Get-Item $zipDesktopDirect).Length) bytes"
Write-Host "  $zipDesktopFolder : $((Get-Item $zipDesktopFolder).Length) bytes"
Write-Host "  $zipLegacy : $((Get-Item $zipLegacy).Length) bytes"
Write-Host "  $zipLocal : $((Get-Item $zipLocal).Length) bytes"
