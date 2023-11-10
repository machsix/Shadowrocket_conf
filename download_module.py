import aiohttp
import asyncio
import os
import aiofiles


async def download_file(session, url, destination_folder):
    async with session.get(url) as response:
        if response.status == 200:
            filename = os.path.join(destination_folder, os.path.basename(url))
            if not filename.endswith('sgmodule'):
                filename += '.sgmodule'
            async with aiofiles.open(filename, 'wb') as f:
                await f.write(f'#!url={url}'.encode('utf-8') + b'\n')
                while True:
                    chunk = await response.content.read(1024)
                    if not chunk:
                        break
                    await f.write(chunk)
            print(f"Downloaded: {url}")


async def download_all_files(urls, destination_folder):
    async with aiohttp.ClientSession() as session:
        tasks = [download_file(session, url, destination_folder)
                 for url in urls]
        await asyncio.gather(*tasks)


async def main():
    # List of URLs to download
    with open('./sg_module', 'r') as f:
        url_list = f.readlines()
    url_list = [i.strip() for i in url_list]

    # Destination folder to save the downloaded files
    destination_folder = "downloads"

    # Create the destination folder if it does not exist
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)

    await download_all_files(url_list, destination_folder)

if __name__ == "__main__":
    asyncio.run(main())
