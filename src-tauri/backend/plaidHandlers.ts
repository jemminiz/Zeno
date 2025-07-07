import { plaidClient } from './plaid';
import type { Request, Response } from 'express';
import { Products, CountryCode } from 'plaid'; // Import Products enum/type from Plaid SDK

export async function getPlaidLinkToken(req: Request, res: Response): Promise<void> {
    const response = await plaidClient.linkTokenCreate({
        user: {
            client_user_id: req.body.clientUserId,
        },
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
        client_name: ''
    });
    res.json({ link_token: response.data.link_token });
}

export async function exchangeToken(req: Request, res: Response) {
    const { public_token } = req.body;
    try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        res.json({ access_token: response.data.access_token, item_id: response.data.item_id });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        res.status(500).json({ error: 'Failed to exchange public token' });
    }
}