import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.sql.Date;

public class Main{
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
			//Create Connection String
			String url = "jdbc:sqlserver//${dbServer};databaseName=${dbName};" +
			"user=${user};password={${pass}};encrypt=false;";
			
			String fullUrl = url
					.replace("${dbServer}", "golem.csse.rose-hulman.edu")
					.replace("${dbName}", "FoodDeliveryjungh")
					.replace("${user}", "FoodDeliveryUserjungh")
					.replace("${pass}", "Password123");
		
			//Create Connection
			Connection connection = null;
			try{
				connection = DriverManager.getConnection(fullUrl);
				//call stored procedure
				
				CallableStatement stmt = connection.prepareCall("{?=call OrderHistorySummary(?)}");
				stmt.registerOutParameter(1, Types.INTEGER);
				stmt.setString(2, "gray17");
				stmt.executeQuery();
				//read the results
//				while (results.next()) {
//					int orderID = results.getInt("OrderID");
//					Date placed = results.getDate("Placed");
//					float totalPrice = results.getFloat("TotalPrice");
//					System.out.println("OrderID: " + orderID + "Placed " + placed + "TotalPrice " + totalPrice);
//				}
				//check return code
				
				int returnCode = stmt.getInt(1);
				if(returnCode == 0) {
					System.out.println("Sucess!");
				}else {
					System.out.println("Error");
				}
				//close connection
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				//close connection
				try {
					if(connection != null && !connection.isClosed())
					connection.close();
				}catch (SQLException e) {
					
				}
			}
	}

}
