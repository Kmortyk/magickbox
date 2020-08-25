package Servlet;

import Model.Account;
import Model.Comment;
import Model.ShopItemPage;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.net.URLDecoder;
import java.sql.*;
import java.util.ArrayList;

@WebServlet(name = "CommentsServlet")
public class CommentsServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:sqlite:D:/VolsuProjects/Internet/untitled2/web/DataBase/magickbox.db";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        String request_type = request.getParameter("type");

        if (request_type != null) {
            try {
                // Open a connection
                Class.forName("org.sqlite.JDBC");
                Connection conn = DriverManager.getConnection(DB_URL/*, USER, PASS*/);

                // Execute SQL query
                Statement statement = conn.createStatement();

                if(request_type.equals("addcomment")){
                    Comment comment = new Comment();
                    comment.item_id = Integer.parseInt(request.getParameter("item_id"));
                    comment.login = request.getParameter("login");
                    comment.message = request.getParameter("message");
                    comment.rating = 0;
                    comment.iconPath = request.getParameter("iconpath");
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    if(addComment(statement, comment)){
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
        String request_type = request.getParameter("type");

        if (request_type != null) {
            try {
                // Open a connection
                Class.forName("org.sqlite.JDBC");
                Connection conn = DriverManager.getConnection(DB_URL/*, USER, PASS*/);

                // Execute SQL query
                Statement statement = conn.createStatement();

                if(request_type.equals("getcomments")){
                    Comment comments[] = getComments(statement, request.getParameter("item_id"));
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");

                    if(comments.length == 0){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(comments);
                        response.getWriter().write(json);
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

    public boolean addComment(Statement statement, Comment comment){
        try {
            return statement.executeUpdate("INSERT INTO Comments (itemid, login, message, rating, iconpath) " +
                    "VALUES ( " +
                    "\'" + comment.item_id + "\', "    +
                    "\'" + comment.login + "\', " +
                    "\'" + comment.message + "\', "    +
                    "\'" + comment.rating + "\', " +
                    "\'" + comment.iconPath + "\' " +
                    ")") > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Comment[] getComments(Statement statement, String item_id){

        ArrayList<Comment> commentsList = new ArrayList<>();

        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM Comments WHERE itemid LIKE " + item_id);
            while(resultSet.next()){
                Comment comment = new Comment();
                comment.item_id = resultSet.getInt("itemid");
                comment.login = resultSet.getString("login");
                comment.message = resultSet.getString("message");
                comment.rating = resultSet.getInt("rating");
                comment.iconPath = resultSet.getString("iconpath");
                commentsList.add(comment);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Comment[] comments = new Comment[commentsList.size()];
        comments = commentsList.toArray(comments);

        return comments;
    }
}
