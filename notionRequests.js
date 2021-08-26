
export const getDatabaseFields = async (client, database_id) => {
    try {
        const response = await client.databases.retrieve({
            database_id
        });
        return Object.keys(response.properties);
    } catch (error) {
        console.error(error.body)
    }
}

export const getDatabasePageIds = async (client, database_id) => {
    try {
        const response = await client.databases.query({
            database_id
        });
        return response.results.map(page => page.id);
    } catch (error) {
        console.error(error.body)
    }
}

export const getPageValues = async (client, page_id) => {
    try {
        const response = await client.pages.retrieve({
            page_id
        });
        return response;
    } catch (error) {
        console.error(error.body)
    }
}

