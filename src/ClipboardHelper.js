export async function copyTextToClipboard(value)
{
    await navigator.clipboard.writeText(value);
}

export async function pasteTextFromClipboard()
{
    return await navigator.clipboard.readText();
}
