package Servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "Servlet.ServletExample")
public class ServletExample extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //Cart cart = getCartFromSession(req);

        String action = request.getParameter("action");
        String item = request.getParameter("item");

        if ((action != null)&&(item != null)) {

            // Добавить или удалить продукт из Cart
            if (action.equals("add")) {
                System.out.println("added " + item);
                //cart.addItem(item);
            } else if (action.equals("remove")) {
                System.out.println("removed " + item);
                //cart.removeItems(item);

            }
        }

        // Сериализуем состояние Cart в  XML-формате
        //String cartXml = cart.toXml();

        // Записываем полученный XML в запрос.
        System.out.println("somth happen\n");
        response.setContentType("application/xml");
        response.getWriter().write("cartXml");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String data = "Hello World from doGet()!"; // creates a String
        response.setContentType("text/plain"); // sets the content type
        response.setCharacterEncoding("UTF-8"); // sets the encoding
        response.getWriter().write(data);

        //request.getRequestDispatcher("/web/about.html").forward(request, response);
    }
}
