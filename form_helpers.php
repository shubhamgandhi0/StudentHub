<?php
function clean_input(string $value): string
{
    return trim(strip_tags($value));
}

function read_records(string $file): array
{
    if (!file_exists($file)) {
        return [];
    }

    $contents = file_get_contents($file);
    $records = json_decode($contents ?: '[]', true);
    return is_array($records) ? $records : [];
}

function save_record(string $file, array $record): bool
{
    $records = read_records($file);
    $records[] = $record;
    $json = json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    return $json !== false && file_put_contents($file, $json . PHP_EOL, LOCK_EX) !== false;
}

function show_result(string $title, string $message, bool $success, string $backLink): void
{
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $safeBackLink = htmlspecialchars($backLink, ENT_QUOTES, 'UTF-8');
    $statusClass = $success ? 'success' : 'error';

    echo "<!DOCTYPE html>\n";
    echo "<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>{$safeTitle}</title>";
    echo "<style>body{font-family:Arial,sans-serif;background:#f4f4f4;color:#222;margin:0;padding:40px}.result{max-width:560px;margin:80px auto;padding:32px;background:#fff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1)}.success{color:#087f5b}.error{color:#c92a2a}a{display:inline-block;margin-top:20px;color:#0b7285;font-weight:600}</style></head>";
    echo "<body><main class=\"result\"><h1 class=\"{$statusClass}\">{$safeTitle}</h1><p>{$safeMessage}</p><a href=\"{$safeBackLink}\">Return to form</a></main></body></html>";
}

function storage_file(string $name): string
{
    $directory = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    return $directory . DIRECTORY_SEPARATOR . $name;
}
?>
