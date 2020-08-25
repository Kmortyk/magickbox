package Servlet;

import Model.Account;
import Model.ShopItem;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.util.UUID;


@WebServlet(name = "AccountServlet")
public class AccountServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:sqlite:D:/VolsuProjects/Internet/untitled2/web/DataBase/magickbox.db";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String request_type = request.getParameter("type");

        if (request_type != null) {
            try {
                // Open a connection
                Class.forName("org.sqlite.JDBC");
                Connection conn = DriverManager.getConnection(DB_URL/*, USER, PASS*/);

                // Execute SQL query
                Statement statement = conn.createStatement();

                if(request_type.equals("profile")){
                    String request_login = request.getParameter("login");
                    Account account = getAccountProfile(statement, request_login);

                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    if(account == null){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(account);
                        response.getWriter().write(json);
                    }
                }

                if(request_type.equals("login")){
                    String request_login = request.getParameter("login");
                    String request_password = request.getParameter("password");
                    Account account = getAccount(statement, request_login, request_password);

                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    if(account == null){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(account);
                        response.getWriter().write(json);
                    }
                }

                if(request_type.equals("registration")){
                    String request_login = request.getParameter("login");
                    String request_email = request.getParameter("email");
                    String request_password = request.getParameter("password");

                    Account account = new Account();
                    account.login = request_login;
                    account.email = request_email;
                    account.password = request_password;
                    if(account.iconPath == null) account.iconPath = "img/account_icon.png";

                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    String uniqueKey = getUniqueKey(account.login);

                    if(addUnverifiedAccount(statement, account, uniqueKey)){
                        response.getWriter().write("{ \"uk\":" + uniqueKey + "}");
                    }else{
                        response.getWriter().write("");
                    }
                }

                if(request_type.equals("verification")){
                    String request_uk = request.getParameter("uk");
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    if(confirmAccount(statement, request_uk)){
                        response.getWriter().write("{ \"successfully\": true }");
                    }else{
                        response.getWriter().write("{ \"successfully\": false }");
                    }
                }

                statement.close();
                conn.close();
            } catch (Exception e) {
                System.out.println("ItemsServlet exception");
                e.printStackTrace();
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    private Account getAccount(Statement statement, String login, String password){
        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM Accounts WHERE login LIKE \'" + login+"\'");
            Account account = new Account();
            if(resultSet.next()){
                if(!password.equals(resultSet.getString("password"))){
                    account.checkpassword = false;
                    return account;
                }

                account.login = resultSet.getString("login");
                account.email = resultSet.getString("email");
                account.iconPath = resultSet.getString("iconpath");
                return account;
            }else{
                account.checklogin = false;
                return account;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private boolean addUnverifiedAccount(Statement statement, Account account, String UniqueKey){
        try {
            return statement.executeUpdate("INSERT INTO UnverifiedAccounts (login, password, email, iconpath, UniqueKey) " +
                    "VALUES ( " +
                    "\'" + account.login + "\', "    +
                    "\'" + account.password + "\', " +
                    "\'" + account.email + "\', "    +
                    "\'" + account.iconPath + "\'," +
                    "\'" + UniqueKey + "\' )") > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean confirmAccount(Statement statement, String uk){

        try {
            boolean is_inserted = false, is_deleted = false;
            ResultSet resultSetUA = statement.executeQuery("SELECT * FROM UnverifiedAccounts " +
                    "WHERE UniqueKey LIKE \'" + uk + "\'");

            if(resultSetUA.next()){
                String iconPath = resultSetUA.getString("iconpath");
                if(iconPath == null) iconPath = "img/account_icon.png";
                is_inserted = statement.executeUpdate("INSERT INTO Accounts (login, password, email, iconpath) " +
                        "VALUES ( " +
                        "\'" + resultSetUA.getString("login") + "\', "    +
                        "\'" + resultSetUA.getString("password") + "\', " +
                        "\'" + resultSetUA.getString("email") + "\', "    +
                        "\'" + iconPath + "\' )") > 0;
            }

            is_deleted = statement.executeUpdate("DELETE FROM UnverifiedAccounts " +
                    "WHERE UniqueKey LIKE \'" + uk + "\'") > 0;
            return is_inserted && is_deleted;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Account getAccountProfile(Statement statement, String login){
        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM Accounts WHERE login LIKE \'" + login+"\'");
            Account account = new Account();
            if(resultSet.next()){
                account.login = resultSet.getString("login");
                account.email = resultSet.getString("email");
                account.iconPath = resultSet.getString("iconpath");
                return account;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private String getUniqueKey(String seed){
        return Integer.toString(seed.hashCode());
    }
}
