package Servlet;

import Model.ShopItem;
import Model.ShopItemPage;
import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.sql.*;


@WebServlet(name = "Servlet.ItemsServlet")
public class ItemsServlet extends HttpServlet {
    private static final String DB_URL = "jdbc:sqlite:D:/VolsuProjects/Internet/untitled2/web/DataBase/magickbox.db";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String request_type = request.getParameter("type");
        if (request_type != null) {
            try {
                // Open a connection
                Class.forName("org.sqlite.JDBC");
                Connection conn = DriverManager.getConnection(DB_URL/*, USER, PASS*/);

                // Execute SQL query
                Statement statement = conn.createStatement();

                if(request_type.equals("itempage")){
                    String request_id = request.getParameter("id");
                    ShopItemPage shopItemPage = getItemPageById(statement, request_id);
                    if(shopItemPage == null){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(shopItemPage);
                        response.getWriter().write(json);
                    }
                }

                if(request_type.equals("item")){
                    String request_id = request.getParameter("id");
                    ShopItem shopItem = getItemById(statement, request_id);
                    if(shopItem == null){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(shopItem);
                        response.getWriter().write(json);
                    }
                }

                if(request_type.equals("itemcategory")){
                    String request_id = request.getParameter("id");
                    String request_category = request.getParameter("category");
                    ShopItem shopItem = getItemById(statement, request_id);
                    if(shopItem == null){
                        response.getWriter().write("");
                    }else{
                        if(shopItem.category.equals(request_category)) {
                            shopItem.correctCategory = true;
                            String json = new Gson().toJson(shopItem);
                            response.getWriter().write(json);
                        }else{
                            response.getWriter().write("{ \"correctCategory\": false }");
                        }
                    }
                }

                if(request_type.equals("itemsearch")){
                    String request_v = request.getParameter("v");
                    ShopItem[] shopItems = findItems(statement, request_v);
                    if(shopItems == null){
                        response.getWriter().write("");
                    }else{
                        String json = new Gson().toJson(shopItems);
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

    private ShopItem getItemById(Statement statement, String request_id){
        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM ShopItems WHERE id = " + request_id);
            if(resultSet.next()){
                ShopItem si = new ShopItem();
                si.id = resultSet.getInt("id");
                si.name = resultSet.getString("name");
                si.description = resultSet.getString("description");
                si.priceType = resultSet.getInt("pricetype");
                si.price = resultSet.getDouble("price");
                si.imagePath = resultSet.getString("imagepath");
                si.category = resultSet.getString("category");
                return si;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private ShopItemPage getItemPageById(Statement statement, String request_id){
        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM ShopItems WHERE id = " + request_id);
            if(resultSet.next()){
                ShopItemPage sip = new ShopItemPage();
                sip.name = resultSet.getString("name");
                sip.description = resultSet.getString("description");
                sip.priceType = resultSet.getInt("pricetype");
                sip.price = resultSet.getDouble("price");
                sip.imagePath = resultSet.getString("imagepath");
                return sip;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    private ShopItem[] findItems(Statement statement, String value){

        ArrayList<ShopItem> itemsList = new ArrayList<>();

        try {
            ResultSet resultSet = statement.executeQuery("SELECT * FROM ShopItems WHERE name LIKE \"%" + value + "%\" " +
             "OR category LIKE \"%" + value + "%\"");
            while(resultSet.next()){
                ShopItem si = new ShopItem();
                si.id = resultSet.getInt("id");
                si.name = resultSet.getString("name");
                si.description = resultSet.getString("description");
                si.priceType = resultSet.getInt("pricetype");
                si.price = resultSet.getDouble("price");
                si.imagePath = resultSet.getString("imagepath");
                itemsList.add(si);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        ShopItem[] items = new ShopItem[itemsList.size()];
        items = itemsList.toArray(items);

        return items;
    }

}
