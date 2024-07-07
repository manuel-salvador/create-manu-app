# Comandos a ejecutar en cada pestaña
$commands = @(
    "yarn chain",
    "yarn deploy",
    "yarn start"
)

# Abrir nuevas pestañas en Windows Terminal y ejecutar comandos
for ($i = 0; $i -lt $commands.Length; $i++) {
    $command = $commands[$i]
    $wtCommand = "wt -w 0 -d . pwsh.exe -NoLogo -NoExit -Command `"$command`""
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `"$wtCommand`"" -Wait

    # Esperar según el índice del comando
    if ($i -eq 0) {
        # Esperar 10 segundos después del primer comando
        Start-Sleep -Seconds 8
    }
    elseif ($i -eq 1) {
        # Esperar 5 segundos después del segundo comando
        Start-Sleep -Seconds 5
    }
    # No esperar después del tercer comando (índice 2)
}