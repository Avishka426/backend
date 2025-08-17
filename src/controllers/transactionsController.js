import {sql} from '../config/db.js';

export async function getTransactionsByUserId(req, res){
        try{
            const {userId}=req.params;
           
            const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `;
    
            res.status(200).json(transactions);
            console.log("Transactions fetched successfully");
            
        } catch (error) {
            console.error("Error fetching transactions", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    
}

export async function deleteTransactionById(req, res){
    
        try{
            const {id} = req.params;
            const result = await sql`
                DELETE FROM transactions WHERE id = ${id} RETURNING *`;
            if(result.length === 0) {
                return res.status(404).json({ error: "Transaction not found" });
            }
            console.log("Transaction deleted successfully");
            res.status(200).json({ message: "Transaction deleted successfully" });
        }catch (error) {
            console.error("Error deleting transaction", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
   
}

export async function createTransaction(req, res) {
    try{
        const {user_id, title, amount, catagory} = req.body;
        
        if(!user_id || !title || !amount || !catagory) {
            return res.status(400).json({ error: "All fields (user_id, title, amount, catagory) are required" });
        }
        
        const result = await sql`
            INSERT INTO transactions (user_id, title, amount, catagory)
            VALUES (${user_id}, ${title}, ${amount}, ${catagory})
            RETURNING *`;
            
        console.log("Transaction created successfully");
        res.status(201).json({ 
            message: "Transaction created successfully",
            transaction: result[0]
        });
    }catch (error) {
        console.error("Error creating transaction", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getSummaryByUserId(req, res) {
   
    try{
        const {userId} = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id = ${userId}`;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`; 
            
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount),0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;        

        res.status(200).json({
            balance: parseFloat(balanceResult[0].balance),
            income: parseFloat(incomeResult[0].income),
            expenses: Math.abs(parseFloat(expensesResult[0].expenses))
        });
        console.log("Transaction summary fetched successfully");
    }catch (error) {
        console.error("Error fetching transaction summary", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}