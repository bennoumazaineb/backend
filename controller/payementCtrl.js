const axios = require("axios");
const userModel = require("../models/userModel");
const factureModel = require("../models/factureModel");
const sendEmail = require("./emailCtrl");

module.exports = {
  Add: async (req, res) => {
    try {
      const url = "https://developers.flouci.com/api/generate_payment";
      const payload = {
        app_token: "6c1734d9-1221-489b-94d8-4ad0200628ef",
        app_secret: process.env.FLOUCI_SECRET,
        amount: req.body.amount,
        accept_card: true,
        session_timeout_secs: 1200,
        success_link: "https://gedproject.site/success",
        fail_link: "https://gedproject.site/fail",
        developer_tracking_id: "f4329b11-fe3f-4ab5-84af-702c30fce808",
      };

      const response = await axios.post(url, payload);
      res.send(response.data);
    } catch (error) {
      console.error("Failed to generate payment:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },

  Verify: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const response = await axios.get(`https://developers.flouci.com/api/verify_payment/${paymentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'apppublic': '6c1734d9-1221-489b-94d8-4ad0200628ef',
          'appsecret': process.env.FLOUCI_SECRET,
        },
        
      });
      res.send(response.data);
      const { result } = response.data;

      if (result && result.status === 'SUCCESS') {
        const admin = await userModel.findOne({ role: 'admin' });

  

        const emailContent = {
          from: process.env.EMAIL_USER,
          to: admin.email,
          subject: 'Paiement vérifié avec succès',
          text: `Le paiement a été vérifié avec succès pour la facture du client ${req.body.userName}.`,
        };

        await sendEmail(emailContent);

 
      } else {
        // Envoyer la réponse si le paiement a échoué
        res.status(400).json({ message: 'Le paiement a échoué' });
      }
    } catch (error) {
      console.error("Failed to verify payment:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
};
