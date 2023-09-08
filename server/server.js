 import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
 


//add
import bodyParser from 'body-parser';
// import cv from 'opencv4nodejs';
// import performIntrusionDetection from './IntrusionDetection';
// import performWireCrossingDetection from './wirecrossing';
// import performLoiteringDetection from './loitering';
// import performMotionDetection from './motion';

//stop 

const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT","DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

// Parse JSON requests
app.use(bodyParser.json());//add

//databse

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "trial"
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

con.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

//admin side

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, salary, address,selectedCam } = req.body; 
    const sql = "UPDATE employee SET name = ?, email = ?, salary = ?, address = ?,selectedCamera=? WHERE id = ?";
    
    con.query(sql, [name, email, salary, address,selectedCam, id], (err, result) => {
        if (err) return res.json({ Error: "Failed to update employee in database" });
        return res.json({ Status: "Success" });
    });
});


app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
}

app.get('/dashboard',verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, id: req.id})
})

//dashboard display start
app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})
app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})

app.get('/salary', (req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})

//dashboard display end

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users Where username = ? AND  password = ?";
    console.log('SQL Query:', sql);
    console.log('Parameters:', [req.body.email, req.body.password]);
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query" });

        if(result.length > 0) {
            const id = result[0].id;
            const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
            return res.json({Status: "Success"})
        } else {
            return res.json({Status: "Error" , Error: "Wrong Email or Password"
        });
        }
    })
})

 //employee start

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ Status: "Error", Error: "Username and password are required." });
    }

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    con.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: "Error", Error: "Error in running query." });
        }

        if (result.length > 0) {
            // Authentication successful
            return res.status(200).json({ Status: "Success" });
        } else {
            // Authentication failed
            return res.status(401).json({ Status: "Error", Error: "Wrong email or password." });
        }
    });
});


app.post('/employeelogin', (req, res) => {
    const sql = "SELECT * FROM employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", id: result[0].id})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
                
            })
            
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
})

app.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})


//employee end

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.post('/create',upload.single('image'), (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`,`address`,`salary`,`image`,`selectedCamera`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password"});
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename,
            req.body.selectedCam
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Error: "Inside singup query"});
            return res.json({Status: "Success"});
        })
    } )
})




// //add
// // Define the route for intrusion detection
// app.post('/api/intrusion', (req, res) => {
//   const roiCoordinates = req.body;

//   // Load your video stream (e.g., from an IP camera or a file)
//   const videoCapture = new cv.VideoCapture('your_video_stream_url_or_file_path');

//   // Define the region of interest (ROI) based on received coordinates
//   const { startX, startY, endX, endY } = roiCoordinates;
//   const roiWidth = endX - startX;
//   const roiHeight = endY - startY;

//   // Process each frame of the video feed
//   while (true) {
//     const frame = videoCapture.read(); // Read a frame

//     // Extract the ROI from the frame
//     const roi = frame.getRegion(new cv.Rect(startX, startY, roiWidth, roiHeight));

//     // Perform intrusion detection using the imported function
//     const intrusionDetected = performIntrusionDetection(roi);

//     // Send the intrusion detection result to the frontend
//     res.json({ intrusionDetected });

//     // Exit the loop if intrusion is detected
//     if (intrusionDetected) {
//       break;
//     }

//     // Optional: Display the frame with detected intrusions (comment out if not needed)
//     cv.imshow('Intrusion Detection', frame);
//     cv.waitKey(30); // Adjust frame rate as needed
//   }
// });

// // Define the route for wire crossing detection
// app.post('/api/wirecrossing', (req, res) => {
//     const { frameData, roiCoordinates } = req.body;
  
//     // Convert the frame data (base64 encoded) back to an OpenCV frame
//     const frame = cv.imdecode(Buffer.from(frameData, 'base64'));
  
//     const prevFrameObjects = [];
  
//     // Call the imported wire crossing detection function
//     const wireCrossingDetected = performWireCrossingDetection(frame, prevFrameObjects, roiCoordinates);
  
//     if (wireCrossingDetected) {
//       res.json({ wireCrossingDetected: true });
//     } else {
//       res.json({ wireCrossingDetected: false });
//     }
//   });


//   app.post('/api/loitering', (req, res) => {
//     const { roiData, minTimeThresholdInSeconds } = req.body;
  
//     // Convert the ROI data and parameters to appropriate formats as needed
  
//     // Call the imported loitering detection function
//     const loiteringDetected = performLoiteringDetection(roiData, minTimeThresholdInSeconds);
  
//     if (loiteringDetected) {
//       res.json({ loiteringDetected: true });
//     } else {
//       res.json({ loiteringDetected: false });
//     }
//   });
  
// // Define the route for motion detection
// app.post('/api/motion', (req, res) => {
//     const { roiData, frameDiffThreshold } = req.body;
  
//     // Convert the ROI data and parameters to appropriate formats as needed
  
//     // Call the imported motion detection function
//     const motionDetected = performMotionDetection(roiData, frameDiffThreshold);
  
//     if (motionDetected) {
//       res.json({ motionDetected: true });
//     } else {
//       res.json({ motionDetected: false });
//     }
//   });

// Handle POST request for ROI coordinates
app.post('/api/intrusion', (req, res) => {
    // Retrieve ROI coordinates from the request body
    const { startX, startY, endX, endY , cameraId, algorithmId} = req.body;
  
    // Insert ROI coordinates into the "cameras" table in the "trial" database
    const sql = 'INSERT INTO cameras (startX, startY, endX, endY,`cameraId`, `algorithmId`) VALUES (?, ?, ?, ?,?,1)';
    con.query(sql, [ startX, startY, endX, endY, cameraId, algorithmId], (err, result) => {
      if (err) {
        console.error('Error inserting ROI coordinates into the database:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      console.log('ROI coordinates inserted into the database');
      res.status(200).json({ message: 'ROI coordinates received and saved successfully' });
    });
  });

  app.post('/api/motion', (req, res) => {
    // Retrieve ROI coordinates from the request body
    const { startX, startY, endX, endY , cameraId, algorithmId} = req.body;
  
    // Insert ROI coordinates into the "cameras" table in the "trial" database
    const sql = 'INSERT INTO cameras (startX, startY, endX, endY,`cameraId`, `algorithmId`) VALUES (?, ?, ?, ?,?,2)';
    con.query(sql, [ startX, startY, endX, endY, cameraId, algorithmId], (err, result) => {
      if (err) {
        console.error('Error inserting ROI coordinates into the database:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      console.log('ROI coordinates inserted into the database');
      res.status(200).json({ message: 'ROI coordinates received and saved successfully' });
    });
  });

  app.post('/api/wirecrossing', (req, res) => {
    // Retrieve ROI coordinates from the request body
    const { startX, startY, endX, endY , cameraId, algorithmId} = req.body;
  
    // Insert ROI coordinates into the "cameras" table in the "trial" database
    const sql = 'INSERT INTO cameras (startX, startY, endX, endY,`cameraId`, `algorithmId`) VALUES (?, ?, ?, ?,?,3)';
    con.query(sql, [ startX, startY, endX, endY, cameraId, algorithmId], (err, result) => {
      if (err) {
        console.error('Error inserting ROI coordinates into the database:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      console.log('ROI coordinates inserted into the database');
      res.status(200).json({ message: 'ROI coordinates received and saved successfully' });
    });
  });

  app.post('/api/loitering', (req, res) => {
    // Retrieve ROI coordinates from the request body
    const { startX, startY, endX, endY , cameraId, algorithmId} = req.body;
  
    // Insert ROI coordinates into the "cameras" table in the "trial" database
    const sql = 'INSERT INTO cameras (startX, startY, endX, endY,`cameraId`, `algorithmId`) VALUES (?, ?, ?, ?,?,4)';
    con.query(sql, [ startX, startY, endX, endY, cameraId, algorithmId], (err, result) => {
      if (err) {
        console.error('Error inserting ROI coordinates into the database:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      console.log('ROI coordinates inserted into the database');
      res.status(200).json({ message: 'ROI coordinates received and saved successfully' });
    });
  });

// //stop add

app.listen(8081, ()=> {
    console.log("Running");
})
