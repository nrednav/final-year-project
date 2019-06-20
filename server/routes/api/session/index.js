// Import dependencies
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');
var gridFsStorage = require('multer-gridfs-storage');
var grid = require('gridfs-stream');
var PDFDocument = require('pdfkit');

const Session = require('../../../db/models/Session').Session;
const User = require('../../../db/models/User').User;

/**
 * Configure DB 
 */
const mongoUri = 'mongodb://localhost:27017/fyp';
const conn = mongoose.createConnection(mongoUri, {
	useNewUrlParser: true
});

let gfs;
conn.once('open', () => {
	gfs = grid(conn.db, mongoose.mongo);
});

/**
 * Configure Multer
 */
var storage = new gridFsStorage({
	url: 'mongodb://localhost:27017/fyp',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				} else {
					const filename = buf.toString('hex') + path.extname(file.originalname);
					const file_info = {
						filename: filename,
						bucketname: 'uploads'
					};
					resolve(file_info);
				}
			});
		});
	}
});
const upload = multer({ storage });

/*
 * ROUTE HANDLERS
 */

/* POST - upload title transfer document*/
router.post('/:session_id/upload-ttd', upload.single('file'), (req, res, next) => {
	var fileId = req.file.id;
	Session.updateOne({
		_id: req.params.session_id
	}, {
		$set: {
			'stages.4.status': 'In Progress',
			'stages.4.mini_stages.1.status': 'ABD',
			'stages.4.mini_stages.1.seller_deposit_status': true,
			'stages.4.active_mini_stage': 1,
			'stages.4.mini_stages.1.title_transfer_document_id': fileId,
			'stages.4.mini_stages.1.title_transfer_document_hash': req.body.ttdHash
		}
	}, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			res.json({
				message: 'uploaded'
			});
		}
	});
});

/* POST - upload title deed draft */
router.post('/:session_id/upload-tdd', (req, res, next) => {
	var ws = gfs.createWriteStream({
		filename: 'title-deed-draft.pdf',
		content_type: 'application/pdf'
	});

	const titleDeedDraft = new PDFDocument;
	titleDeedDraft.pipe(ws);
	titleDeedDraft.text('Title deed draft copy');
	titleDeedDraft.end();

	ws.on('close', (pdf) => {
		console.log(pdf._id);
		Session.updateOne({
			_id: new mongoose.Types.ObjectId(req.params.session_id)
		}, { $set: {
				'stages.4.mini_stages.3.title_deed_draft_id': pdf._id
			}
		}, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				console.log(result);
				res.json({
					message: 'uploaded'
				});
			}
		});
	});
});

/* GET - documents for title deed (draft, final, transfer) */
router.get('/:session_id/title-deed/:type', (req, res, next) => {
	Session.findOne({
		_id: req.params.session_id
	}, (err, session) => {
		if (err) {
			console.log(err);
		} else {
			var documentId;
			if (req.params.type == 'ttd') {
				documentId = session.stages['4'].mini_stages['1'].title_transfer_document_id
			} else if (req.params.type == 'tdd') {
				documentId = session.stages['4'].mini_stages['3'].title_deed_draft_id
			} else if (req.params.type == 'tdo') {
				documentId = session.stages['4'].mini_stages['4'].title_deed_id
			}
			sendDocument(documentId, res, next);
		}
	});
});

/* POST - upload title deed */
router.post('/:session_id/upload-td', (req, res, next) => {

	console.log('Creating original title deed');
	var ws = gfs.createWriteStream({
		filename: 'title-deed.pdf',
		content_type: 'application/pdf'
	});

	const titleDeed = new PDFDocument;
	titleDeed.pipe(ws);
	titleDeed.text('Title deed original');
	titleDeed.end();

	ws.on('close', (pdf) => {
		console.log(pdf._id);
		let dateToday = new Date().toISOString().replace('T', ' ').substr(0, 16)
		Session.updateOne({
			_id: new mongoose.Types.ObjectId(req.params.session_id)
		}, {
			$set: {
				'stages.4.mini_stages.3.status': 'Completed',
				'stages.4.active_mini_stage': 4,
				'stages.4.mini_stages.4.status': 'Completed',
				'stages.4.mini_stages.4.title_deed_id': pdf._id,
				'stages.4.mini_stages.4.finished_at': dateToday,
				'stages.4.status': 'Completed',
				'progress': 4
			}
		}, (error, result) => {
			if (error) {
				console.log(error);
			} else {
				res.json({
					message: 'uploaded'
				});
			}
		});
	});
});

/* POST - upload sale contract */
router.post('/:session_id/upload-sc/', upload.single('file'), (req, res,next) => {
	var fileId = req.file.id
	Session.updateOne({
		_id: req.params.session_id
	}, { $set: {
		'stages.3.sale_contract_id': fileId,
		'stages.3.status': 'In Progress',
		'stages.3.contract_status': 'ASCB'
	}}, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			console.log(result);
			res.json({
				message: 'uploaded'
			});
		}
	});
});

/* POST - upload signed sale contract */
router.post('/:session_id/upload-ssc/', upload.single('file'), (req, res,next) => {
	var fileId = req.file.id
	Session.updateOne({
		_id: req.params.session_id
	}, { $set: {
		'stages.3.signed_sale_contract_id': fileId,
	}}, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			console.log(result);
			res.json({
				message: 'uploaded'
			});
		}
	});
});

/* GET - download sale contract (sc or ssc) */
router.get('/:session_id/contract/:type', (req, res, next) => {
	// Get contract id
	Session.findOne({
		_id: req.params.session_id
	}, (err, session) => {
		if (err) {
			console.log(err);
		} else {
			var contractId;
			if (req.params.type == 'sc') {
				contractId = session.stages['3'].sale_contract_id
			} else if (req.params.type == 'ssc') {
				contractId = session.stages['3'].signed_sale_contract_id
			}
			sendDocument(contractId, res, next);
		}
	});
});

function sendDocument(documentId, res, next)  {
	gfs.files.findOne({
		_id: mongoose.Types.ObjectId(documentId)
	}, (err, document) => {
		if (err) {
			console.log(err);
		} else {

			var rs = gfs.createReadStream({
				filename: document.filename
			});

			res.set('Content-Type', document.contentType);
			res.set('Content-Disposition', 'attachment; filename="' + document.filename + '"');

			rs.on('error', (err) => {
				res.end();
			});
			rs.pipe(res);
		}
	});
}

/* GET session listing. */
router.get('/', function(req, res, next) {
	Session.find((err, docs) => {
		if (err) console.error(err);
		res.json({
			docs: docs
		});
	});
});

/* GET session by id*/
router.get('/get/:session_id', (req, res, next) => {
	const session_id = req.params.session_id;
	Session.findOne({
		_id: session_id
	}, (err, result) => {
		if (err) console.error(err);
		res.json({
			result: result
		});
	});
});

/* GET - check if session exists with buyer and seller id's */
router.get('/exists/', (req, res, next) => {
	let sellerId = req.query.sellerId
	let buyerId = req.query.buyerId

	Session.findOne({
		seller_id: sellerId,
		buyer_id: buyerId
	}, (err, session) => {
		if (err) throw err;
		if (session) {
			res.json({ exists: true });
		} else {
			res.json({ exists: false });
		}
	});
});

/* POST - create a session */
router.post('/create', (req, res, next) => {
	Session.findOne({
		property_id: req.body.property_id
	})
	.then(session => {
		if (session) {
			console.log("Found a session");
			handleError("Session with that property already exists", res, next);
		}
		else {
			console.log("Creating a new session");
			Session.create({
				property_id: req.body.property_id,
				buyer_id: req.body.buyer_id,
				seller_id: req.body.seller_id,
				buyer_address: req.body.buyer_address,
				seller_address: req.body.seller_address,
				'stages.3.agreed_sale_price': req.body.agreed_sale_price
			}, (err, session) => {
				if (err) console.error(err);
				console.log('Linking session to participants...');
				linkSessionToParticipants(session._id, session.buyer_id, session.seller_id,
				res, next);
			});
		}
	});
});

function linkSessionToParticipants(session_id, buyer_id, seller_id, res, next) {
	// First the seller
	User.updateOne({
		_id: seller_id
	}, {
		$push: {
			'profiles.seller.sessions': session_id
		}
	}, (err, result) => {
		if (err) console.log(err);
		console.log(result);
		console.log('Finished linking session to seller... now buyer...');
		// Then the buyer
		User.updateOne({
			_id: buyer_id
		}, {
			$push: {
				'profiles.buyer.sessions': session_id
			}
		}, (err, result) => {
			if (err) console.log(err);
			console.log(result);
			console.log('Finished linking session to buyer');
			res.json({
				message: 'Linked session to participants successfully'
			});
		});
	});
}

/* PUT - update a session */
router.put('/:session_id/update', (req, res, next) =>  {
	console.log('Updating session with id: ' + req.params.session_id);
	Session.updateOne({
		_id: req.params.session_id
	}, req.body.updateOptions, (err) => {
		if (err) handleError(err, res, next);
		res.send(`Successfully updated Session #: ${req.params.session_id}`);
	});
});

/* DELETE - delete a session */
router.delete('/:session_id/delete', (req, res, next) => {
	Session.deleteOne({
		_id: req.params.session_id
	}, (err) => {
		if (err) handleError(err, res, next);
		res.send(`Session ${req.params.session_id} was deleted successfully`);
	});
});

// Error handling
function handleError(errorMsg, res, next) {
	const error = new Error(errorMsg);
	next(error);
}

module.exports = router;
