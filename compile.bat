@echo off

:: this is the temporary way to compile since 
:: the bun build system is not working unless 
:: you build it??? still investigating

:: cd into the project
cd /d %~dp0

:check_permissions
    echo Administrative permissions required. Detecting permissions...
    
    net session >nul 2>&1
    if %errorLevel% == 0 (
        echo Success: Administrative permissions confirmed.
    ) else (
        echo Failure: Please run as administrator.
        pause >nul
        goto end
    )

:ensure_bun_install
    echo Checking if Bun is installed...
    bun --version >nul 2>&1
    if %errorLevel% == 0 (
        echo Bun is installed.
    ) else (
        goto install_bun
    )
    goto compile

:install_bun
    echo Installing Bun...
    echo on
    powershell -c "irm bun.sh/install.ps1 | iex"
    echo off
    if %errorLevel% == 0 (
        echo
        echo Bun installed successfully. But it's not over yet!
        echo Please run this script again to continue the installation!!
        pause
        goto end
    ) else (
        echo Failed to install Bun.
        pause
        goto end
    )
    goto compile

:compile
    echo Installing Bun dependencies...
    bun install
    if %errorLevel% == 0 (
        echo Dependencies installed successfully.
    ) else (
        echo Failed to install dependencies.
        pause
    )
    echo Building executable...
    bun run compile:win
    if %errorLevel% == 0 (
        echo Program compiled successfully. Extract dist.zip to run it!
        pause
        goto end
    ) else (
        echo Failed to compile the program.
        pause
    )

:end
    exit /b

goto check_permissions