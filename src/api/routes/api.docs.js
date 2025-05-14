/**
 * @swagger
 * securityDefinitions:
 *   Bearer:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Enter 'Bearer' [space] and then your token
 */

/**
 * @swagger
 * security:
 *   - Bearer: []
 */
/**
 * @swagger
 * tags:
 *   name: Instance
 *   description: Instances accounts management
 */

/**
 * @swagger
 * /instance/init:
 *   get:
 *     summary: Initialize a new WhatsApp instance
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *       - in: query
 *         name: webhook
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Enable or disable webhook
 *       - in: query
 *         name: webhookUrl
 *         required: false
 *         schema:
 *           type: string
 *         description: The URL for the webhook
 *     responses:
 *       200:
 *         description: Successfully initialized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 key:
 *                   type: string
 *                 webhook:
 *                   type: object
 *                   properties:
 *                     enabled:
 *                       type: boolean
 *                     webhookUrl:
 *                       type: string
 *                 qrcode:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                 browser:
 *                   type: string
 */

/**
 * @swagger
 * /instance/typebot:
 *   post:
 *     summary: Add a TypeBot to an instance
 *     tags: [Instance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               typebot:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   apiHost:
 *                     type: string
 *     responses:
 *       200:
 *         description: TypeBot added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 typebot:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     apiHost:
 *                       type: string
 */

/**
 * @swagger
 * /instance/qr:
 *   get:
 *     summary: Get QR code for an instance
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *     responses:
 *       200:
 *         description: QR code fetched successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

/**
 * @swagger
 * /instance/qrbase64:
 *   get:
 *     summary: Get QR code in base64 format for an instance
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *     responses:
 *       200:
 *         description: QR code base64 fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 qrcode:
 *                   type: string
 */

/**
 * @swagger
 * /instance/info:
 *   get:
 *     summary: Get instance information
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *     responses:
 *       200:
 *         description: Instance information fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 instance_data:
 *                   type: object
 */

/**
 * @swagger
 * /instance/restore:
 *   get:
 *     summary: Restore all instances
 *     tags: [Instance]
 *     responses:
 *       200:
 *         description: All instances restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /instance/logout:
 *   get:
 *     summary: Logout from an instance
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errormsg:
 *                   type: string
 *                   nullable: true
 */

/**
 * @swagger
 * /instance/delete:
 *   delete:
 *     summary: Delete an instance
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the WhatsApp instance
 *     responses:
 *       200:
 *         description: Instance deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *                   nullable: true
 */

/**
 * @swagger
 * /instance/list:
 *   get:
 *     summary: List all instances
 *     tags: [Instance]
 *     parameters:
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter active instances
 *     responses:
 *       200:
 *         description: Instances listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

//AUDIT
/**
 * @swagger
 * /audit/find:
 *   get:
 *     summary: Retrieve audit messages
 *     description: Retrieve audit messages based on query parameters.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the audit message
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         description: The key/identificator of the audit message
 *     responses:
 *       200:
 *         description: A list of audit messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       identificator:
 *                         type: string
 *                       message:
 *                         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: WhatsApp group management
 */

/**
 * @swagger
 * /group/create:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/participant:
 *   post:
 *     summary: Add a new participant to a group
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Participant added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/admin:
 *   post:
 *     summary: Make a participant an admin
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Participant promoted to admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/admin/demote:
 *   post:
 *     summary: Demote an admin to participant
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Admin demoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/all:
 *   get:
 *     summary: List all groups
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     responses:
 *       201:
 *         description: List of all groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /group/leave:
 *   post:
 *     summary: Leave a group
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       201:
 *         description: Left the group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/invite-code:
 *   get:
 *     summary: Get invite code for a group
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       201:
 *         description: Invite code retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 link:
 *                   type: string
 */

/**
 * @swagger
 * /group/instance-invite-code:
 *   get:
 *     summary: Get instance invite code for a group
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       201:
 *         description: Instance invite code retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 link:
 *                   type: string
 */

/**
 * @swagger
 * /group/participants:
 *   post:
 *     summary: Update group participants
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *               action:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group participants updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/settings:
 *   post:
 *     summary: Update group settings
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               action:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/subject:
 *   post:
 *     summary: Update group subject
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group subject updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/description:
 *   post:
 *     summary: Update group description
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group description updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/invite-info:
 *   post:
 *     summary: Get group invite info
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group invite info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /group/join:
 *   post:
 *     summary: Join a group using invite code
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Joined the group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: WhatsApp message management
 */

/**
 * @swagger
 * /text:
 *   post:
 *     summary: Send a text message
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /image:
 *   post:
 *     summary: Send an image message
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Image sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /video:
 *   post:
 *     summary: Send a video message
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /audio:
 *   post:
 *     summary: Send an audio message
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Audio sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /document:
 *   post:
 *     summary: Send a document message
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *               filename:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /mediaurl:
 *   post:
 *     summary: Send a media message via URL
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: WhatsApp instance key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               url:
 *                 type: string
 *               type:
 * 
 */

/**
 * @swagger
 * /onWhatsapp:
 *   get:
 *     summary: Verifies if a WhatsApp ID is valid
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /downProfile:
 *   get:
 *     summary: Downloads a profile picture
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Profile picture data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /getStatus:
 *   get:
 *     summary: Gets the status of a user
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /blockUser:
 *   post:
 *     summary: Blocks or unblocks a user
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: block_status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [block, unblock]
 *     responses:
 *       201:
 *         description: Block or unblock result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /updateProfilePicture:
 *   post:
 *     summary: Updates a profile picture
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               url:
 *                 type: string
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Update result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /getUserOrGroupById:
 *   get:
 *     summary: Gets user or group information by ID
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: User or group information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
