$ErrorActionPreference = "Stop"
$base = "http://localhost:3000/api/v1"
$results = @()

function Test-Step {
    param([string]$Name, [scriptblock]$Code)
    try {
        $r = & $Code
        $script:results += @{ name = $Name; ok = $true; info = $r }
        Write-Output "[OK] $Name -- $r"
    } catch {
        $body = ""
        if ($_.Exception.Response) {
            try {
                $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $body = $sr.ReadToEnd()
            } catch {}
        }
        $script:results += @{ name = $Name; ok = $false; err = "$($_.Exception.Message) | $body" }
        Write-Output "[FAIL] $Name -- $($_.Exception.Message) | $body"
    }
}

# 1) Public catalog endpoints
Test-Step "GET /marcas" {
    $r = Invoke-WebRequest -Uri "$base/marcas" -UseBasicParsing
    $arr = $r.Content | ConvertFrom-Json
    "count=$($arr.Count) status=$($r.StatusCode)"
}

Test-Step "GET /marcas?search=Arturo" {
    $r = Invoke-WebRequest -Uri "$base/marcas?search=Arturo" -UseBasicParsing
    $arr = $r.Content | ConvertFrom-Json
    "count=$($arr.Count)"
}

Test-Step "GET /productos?page=1&page_size=5&sort=name" {
    $r = Invoke-WebRequest -Uri "$base/productos?page=1&page_size=5&sort=name" -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "total=$($j.total) items=$($j.items.Count) page=$($j.page)"
}

Test-Step "GET /productos with fortaleza filter (lowercase)" {
    $r = Invoke-WebRequest -Uri "$base/productos?fortaleza=medio&page=1&page_size=3" -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    $allMedio = $true
    foreach ($p in $j.items) {
        if ($p.fortaleza -ne "medio") { $allMedio = $false }
    }
    "items=$($j.items.Count) allMedio=$allMedio"
}

Test-Step "GET /productos detail" {
    $r = Invoke-WebRequest -Uri "$base/productos/178" -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "id=$($j.id) imagenes=$($j.imagenes.Count) valoraciones=$($j.valoraciones.Count)"
}

Test-Step "GET /productos/9999999 (404 expected)" {
    try {
        Invoke-WebRequest -Uri "$base/productos/9999999" -UseBasicParsing
        throw "should have 404"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) { "ok 404" } else { throw }
    }
}

Test-Step "GET /subcategorias?marca_id=2" {
    $r = Invoke-WebRequest -Uri "$base/subcategorias?marca_id=2" -UseBasicParsing
    $arr = $r.Content | ConvertFrom-Json
    "count=$($arr.Count)"
}

Test-Step "GET /valoraciones" {
    $r = Invoke-WebRequest -Uri "$base/valoraciones?limit=3" -UseBasicParsing
    $arr = $r.Content | ConvertFrom-Json
    "count=$($arr.Count)"
}

# 2) Auth flow
Test-Step "POST /auth/login (wrong creds -> 401)" {
    try {
        Invoke-WebRequest -Uri "$base/auth/login" -Method POST -ContentType "application/x-www-form-urlencoded" -Body "username=nope@nope.com&password=wrong" -UseBasicParsing
        throw "should have 401"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) { "ok 401" } else { throw }
    }
}

Test-Step "POST /auth/login (good creds)" {
    $r = Invoke-WebRequest -Uri "$base/auth/login" -Method POST -ContentType "application/x-www-form-urlencoded" -Body "username=test-migracion@tabacoyron.com&password=Probando1234" -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    $script:token = $j.access_token
    "token len=$($j.access_token.Length) type=$($j.token_type)"
}

$h = @{ Authorization = "Bearer $script:token" }

Test-Step "GET /users/me" {
    $r = Invoke-WebRequest -Uri "$base/users/me" -Headers $h -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "id=$($j.id) role=$($j.role) (must be 'admin')"
}

Test-Step "GET /users (admin only)" {
    $r = Invoke-WebRequest -Uri "$base/users" -Headers $h -UseBasicParsing
    $arr = $r.Content | ConvertFrom-Json
    "count=$($arr.Count)"
}

Test-Step "GET /users WITHOUT auth (401 expected)" {
    try {
        Invoke-WebRequest -Uri "$base/users" -UseBasicParsing
        throw "should have 401"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) { "ok 401" } else { throw }
    }
}

# 3) CRUD marca
$bodyMarca = '{"nombre":"Smoke-Test-Marca-' + (Get-Random -Maximum 99999) + '","imagen":null}'
Test-Step "POST /marcas (create)" {
    $r = Invoke-WebRequest -Uri "$base/marcas" -Method POST -Headers $h -ContentType "application/json" -Body $bodyMarca -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    $script:newMarcaId = $j.id
    "id=$($j.id) status=$($r.StatusCode) total_productos=$($j.total_productos)"
}

Test-Step "PATCH /marcas/{id} (update nombre)" {
    $r = Invoke-WebRequest -Uri "$base/marcas/$script:newMarcaId" -Method PATCH -Headers $h -ContentType "application/json" -Body '{"nombre":"Smoke-Test-Renamed"}' -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "nombre=$($j.nombre)"
}

# 4) Subcategoria
$bodySub = '{"nombre":"Smoke-Sub-' + (Get-Random -Maximum 99999) + '","marca_id":' + $script:newMarcaId + '}'
Test-Step "POST /subcategorias" {
    $r = Invoke-WebRequest -Uri "$base/subcategorias" -Method POST -Headers $h -ContentType "application/json" -Body $bodySub -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    $script:newSubId = $j.id
    "id=$($j.id)"
}

# 5) Producto CRUD
$bodyProd = @{
    nombre = "Smoke-Producto-Test"
    marca_id = $script:newMarcaId
    subcategoria_id = $script:newSubId
    precio_caja = "120.50"
    precio_individual = "5.50"
    fortaleza = "medio"
    cepo = 50
    largo_mm = 127
    rating = 85
    imagenes = @(@{ url = "/static/uploads/test1.jpg"; tipo = "detalle"; orden = 0 })
} | ConvertTo-Json -Depth 5

Test-Step "POST /productos" {
    $r = Invoke-WebRequest -Uri "$base/productos" -Method POST -Headers $h -ContentType "application/json" -Body $bodyProd -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    $script:newProdId = $j.id
    "id=$($j.id) status=$($r.StatusCode) fortaleza=$($j.fortaleza) imagenes=$($j.imagenes.Count)"
}

Test-Step "PATCH /productos/{id} (update precio + replace imagenes)" {
    $body = @{
        precio_caja = "130.00"
        imagenes = @(
            @{ url = "/static/uploads/test1.jpg"; tipo = "detalle"; orden = 0 },
            @{ url = "/static/uploads/test2.jpg"; tipo = "tabaco_suelto"; orden = 1 }
        )
    } | ConvertTo-Json -Depth 5
    $r = Invoke-WebRequest -Uri "$base/productos/$script:newProdId" -Method PATCH -Headers $h -ContentType "application/json" -Body $body -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "precio_caja=$($j.precio_caja) imagenes=$($j.imagenes.Count)"
}

Test-Step "PATCH /productos/{id} (omit imagenes -> keep)" {
    $r = Invoke-WebRequest -Uri "$base/productos/$script:newProdId" -Method PATCH -Headers $h -ContentType "application/json" -Body '{"rating":90}' -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "rating=$($j.rating) imagenes=$($j.imagenes.Count) (must still be 2)"
}

# 6) Valoracion POST (no auth required)
$bodyVal = '{"rating":5,"email":"test@test.com","valoracion":"Excelente smoke test","producto_id":' + $script:newProdId + '}'
Test-Step "POST /valoraciones (public)" {
    $r = Invoke-WebRequest -Uri "$base/valoraciones" -Method POST -ContentType "application/json" -Body $bodyVal -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "id=$($j.id) producto_id=$($j.producto_id) rating=$($j.rating)"
}

Test-Step "GET /productos/{id} (must include nueva valoracion)" {
    $r = Invoke-WebRequest -Uri "$base/productos/$script:newProdId" -UseBasicParsing
    $j = $r.Content | ConvertFrom-Json
    "valoraciones=$($j.valoraciones.Count)"
}

# 7) Cleanup
Test-Step "DELETE /productos/{id}" {
    $r = Invoke-WebRequest -Uri "$base/productos/$script:newProdId" -Method DELETE -Headers $h -UseBasicParsing
    "status=$($r.StatusCode)"
}

Test-Step "DELETE /subcategorias/{id}" {
    $r = Invoke-WebRequest -Uri "$base/subcategorias/$script:newSubId" -Method DELETE -Headers $h -UseBasicParsing
    "status=$($r.StatusCode)"
}

Test-Step "DELETE /marcas/{id}" {
    $r = Invoke-WebRequest -Uri "$base/marcas/$script:newMarcaId" -Method DELETE -Headers $h -UseBasicParsing
    "status=$($r.StatusCode)"
}

# 8) Validation errors
Test-Step "POST /marcas with empty nombre (422 expected)" {
    try {
        Invoke-WebRequest -Uri "$base/marcas" -Method POST -Headers $h -ContentType "application/json" -Body '{"nombre":""}' -UseBasicParsing
        throw "should have 422"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 422) { "ok 422" } else { throw }
    }
}

# Summary
$total = $script:results.Count
$pass = ($script:results | Where-Object { $_.ok }).Count
$fail = $total - $pass
Write-Output "----------"
Write-Output "RESULT: $pass / $total passed, $fail failed"
if ($fail -gt 0) { exit 1 }
