Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strFolder = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strFolder
WshShell.Run "cmd /c taskkill /f /im python.exe >nul 2>&1", 0, True
WshShell.Run "cmd /c python -m http.server 8080", 0, False
WScript.Sleep 2000
WshShell.Run "http://localhost:8080/index.html"
