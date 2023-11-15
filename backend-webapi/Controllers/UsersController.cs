using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services;
using System.Collections.Generic;
using System.Threading.Tasks; //Should be good?

[Route("api/v1/users")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // GET /api/v1/users
    [HttpGet("")]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    // GET /api/v1/users/:NetID
    [HttpGet("{NetID}")]
    public async Task<ActionResult<User>> GetUser(long NetID)
    {
        var user = await _userService.GetUserByNetIDAsync(NetID);
        if (user != null)
        {
            return Ok(user);
        }
        else
        {
            return NotFound(); // If user is not found, return a NotFound result
        }
    }
}
