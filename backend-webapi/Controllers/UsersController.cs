using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services; // Assume you have service classes for business logic

namespace ReservationApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // Adding CRUD operations here, similar to the RoomResController example provided before
    }
}