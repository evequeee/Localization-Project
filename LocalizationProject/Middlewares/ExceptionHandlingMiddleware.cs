using System.Net;
using System.Text.Json;

namespace LocalizationProject.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); 
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Сталася непередбачувана помилка");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var result = JsonSerializer.Serialize(new { 
            error = "Внутрішня помилка сервера. Ми вже розбираємось!",
            details = exception.Message // На етапі розробки можна лишити, для релізу краще прибрати
        });
        
        return context.Response.WriteAsync(result);
    }
}