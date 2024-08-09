package main

import (
    "log"
    "encoding/json"
    "fmt"
    "net/http"
	"strings"
	"database/sql"
)

type Data struct {
	Username string `json:"username"`
	Calories int `json:"calories"`
	Protein int `json:"protein"`
	Fat int `json:"fat"`
	Carbs int `json:"carbs"`
	Sugar int `json:"sugar"`
	Fiber int `json:"fiber"`
	Meal string `json:"meal"`
}

type Response struct {
    Status  string `json:"status"`
    Message string `json:"message"`
}

type recieveData struct {
	Username string `json:"username"`
	Requested []string `json:"requested"`
}

type sendData struct {
	Username string `json:"username"`
	NutrientData map[string]map[string]int `json:"nutrientData"`
}

//Reviewed
func newUser(w http.ResponseWriter, r *http.Request) { //Send as a query
	name := r.URL.Query().Get("user_email")

	if name == "" {
        	http.Error(w, "user_email query parameter is required", http.StatusBadRequest)
        	log.Println("Missing user_email query parameter")
        	return
	}	

	log.Printf("Received request to create user with email: %s", name)

	var existingUsername string
	query := "SELECT UserEmail FROM Users WHERE UserEmail = ?"
	err := db.QueryRow(query, name).Scan(&existingUsername)

	//SQL COMMAND
	if err != nil {
        if err == sql.ErrNoRows {
			tx, err := db.Begin()
			if err != nil {
				http.Error(w, "Error starting transaction", http.StatusInternalServerError)
				return
			}

            // Username doesn't exist, so insert it in the users, day, week, and month tables
            insertQuery := "INSERT INTO Users (UserEmail) VALUES (?)"
            _, err0 := tx.Exec(insertQuery, name)
            if err0 != nil {
				tx.Rollback()
                http.Error(w, "Error inserting user", http.StatusInternalServerError)
                return
            }

			insertDayQuery := "INSERT INTO Day (UserEmail) VALUES (?)"
			_, err1 := tx.Exec(insertDayQuery, name)
            if err1 != nil {
				tx.Rollback()
                http.Error(w, "Error inserting user into Day", http.StatusInternalServerError)
                return
            }

			insertWeekQuery := "INSERT INTO Week (UserEmail) VALUES (?)"
			_, err2 := tx.Exec(insertWeekQuery, name)
            if err2 != nil {
				tx.Rollback()
                http.Error(w, "Error inserting user into Week", http.StatusInternalServerError)
                return
            }

			insertMonthQuery:= "INSERT INTO Month (UserEmail) VALUES (?)"
			_, err3 := tx.Exec(insertMonthQuery, name)
            if err3 != nil {
				tx.Rollback()
                http.Error(w, "Error inserting user into Month", http.StatusInternalServerError)
                return
            }

			err = tx.Commit()
			if err != nil {
				http.Error(w, "Error committing transaction", http.StatusInternalServerError)
				return
			}

			return 
        } else {
            http.Error(w, "Database error", http.StatusInternalServerError)
            return
        }	
	} 

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Status: "complete", Message: "User either added or already exists"})
    	log.Println("User either added or already exists")
}

//Reviewed
func buildSelectClause(columns []string) string {
	return strings.Join(columns, ", ")
}

//Reviewed
func populateNutrientData(result *sql.Rows, dataMap map[string]int) error {
    cols, err := result.Columns()
    if err != nil {
        return err
    }

    vals := make([]interface{}, len(cols))
    for i := range cols {
        vals[i] = new(int)
    }

    for result.Next() {
        err = result.Scan(vals...)
        
		if err != nil {
            return err 
        }

        for i, col := range cols {
            (dataMap)[col] = *vals[i].(*int)
        }
    }

    return result.Err()
}

//Reviewed
func getData(w http.ResponseWriter, r *http.Request) { //Send as body (use JSON.stringify method in the front-end)

	if r.Method != http.MethodPost {
        	http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        	return
   	}

	var recieved recieveData

	err := json.NewDecoder(r.Body).Decode(&recieved)

	if err != nil {
        http.Error(w, "Unable to decode data", http.StatusBadRequest)
        return
	}

	username := recieved.Username
	requested := recieved.Requested

	if username == "" {
        http.Error(w, "User email is required", http.StatusBadRequest)
        return
    }

	data := sendData{
		Username: username,
		NutrientData: map[string]map[string]int{
            "Day":   make(map[string]int),
            "Week":  make(map[string]int),
            "Month": make(map[string]int),
        },
	}

	for i := 0; i < len(requested); i++ {
		data.NutrientData["Day"][requested[i]] = 0 
		data.NutrientData["Week"][requested[i]] = 0 
		data.NutrientData["Month"][requested[i]] = 0 
	}

	selectClause := buildSelectClause(requested) //Returns a string of the columns you want to select

	dayQuery := fmt.Sprintf("SELECT %s FROM Day WHERE UserEmail = ?", selectClause)
	dayResult, err := db.Query(dayQuery, username)
	if err != nil {
		http.Error(w, "Cannot retrieve data from Day", http.StatusInternalServerError) 
		return 
	}

	defer dayResult.Close()

	weekQuery := fmt.Sprintf("SELECT %s FROM Week WHERE UserEmail = ?", selectClause)
	weekResult, err1 := db.Query(weekQuery, username)
	if err1 != nil {
		http.Error(w, "Cannot retrieve data from Week", http.StatusInternalServerError)
		return 
	}

	defer weekResult.Close()

	monthQuery := fmt.Sprintf("SELECT %s FROM Month WHERE UserEmail = ?", selectClause)
	monthResult, err2 := db.Query(monthQuery, username)
	if err2 != nil {
		http.Error(w, "Cannot retrieve data from Month", http.StatusInternalServerError)
		return 
	}

	defer monthResult.Close()


	if err3 := populateNutrientData(dayResult, data.NutrientData["Day"]); err3 != nil {
		http.Error(w, "Cannot populate data for Day", http.StatusInternalServerError) 
		return 
	}
	if err4 := populateNutrientData(weekResult, data.NutrientData["Week"]); err4 != nil {
		http.Error(w, "Cannot populate data for Week", http.StatusInternalServerError)
		return 
	}
	if err5 := populateNutrientData(monthResult, data.NutrientData["Month"]); err5 != nil {
		http.Error(w, "Cannot populate data for Month", http.StatusInternalServerError)
		return 
	}

	w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}


func writeMeal(w http.ResponseWriter, r *http.Request) { //Send as body
	
	if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

	var data Data

	err := json.NewDecoder(r.Body).Decode(&data)

	if err != nil {
        http.Error(w, "Unable to decode data", http.StatusBadRequest)
        return
	}

	username := data.Username

	if username == "" {
	log.Printf("User email is required")
        http.Error(w, "UserEmail is required", http.StatusBadRequest)
        return
    }

	//WRITE THE MEAL TO THE MEAL TABLE
	insertQuery := "INSERT INTO Meals (UserEmail, Meal) VALUES (?, ?)"
	_, err = db.Exec(insertQuery, data.Username, data.Meal)

	if err != nil {
		log.Printf("Error Updating Day Table")
		http.Error(w, "Error updating Day table", http.StatusInternalServerError)
		return 
	}

	// Functions to update nutrients for Day, Week, and Month
	updateNutrients := func(table string) error {
		query := `
			UPDATE ` + table + ` 
			SET Calories = Calories + ?, Protein = Protein + ?, Fat = Fat + ?, Carbs = Carbs + ?, Sugar = Sugar + ?, Fiber = Fiber + ? 
			WHERE UserEmail = ?
		`
		_, err := db.Exec(query, data.Calories, data.Protein, data.Fat, data.Carbs, data.Sugar, data.Fiber, data.Username)
		return err
	}

	// Update nutrients for Day, Week, and Month
	for _, table := range []string{"Day", "Week", "Month"} {
		if err := updateNutrients(table); err != nil {
			log.Printf("Error Updating table")
			http.Error(w, "Error updating "+table+" table", http.StatusInternalServerError)
			return
		}
	}

	log.Printf("Almost done")
	
	w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(Response{Status: "complete", Message: "Foods have been stored"})
    log.Println("Foods have been stored successfully")

}


func favoriteMeals(w http.ResponseWriter, r *http.Request) { //send username as query string
	username := r.URL.Query().Get("user_email")

	if username == "" {
        http.Error(w, "User email is required", http.StatusBadRequest)
        return
    }

	query := `
		SELECT Meal
		FROM Meals
		WHERE UserEmail = ?
		GROUP BY Meal
		ORDER BY COUNT(*) DESC
		LIMIT ?
	`
	rows, err := db.Query(query, username, 5)
	if err != nil {
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }
	defer rows.Close()

	// Collect meal values into a slice
	var meals []string 
	for rows.Next() {
		var meal string
		if err := rows.Scan(&meal); err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		meals = append(meals, meal)
	}

	if err := rows.Err(); err != nil {
        http.Error(w, "Error iterating over rows", http.StatusInternalServerError)
        return
    }

    // Encode meals as JSON and send the response
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(meals)
}
