using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public interface IRoomResService
    {
        Task<IEnumerable<RoomRes>> GetAllRoomReservationsAsync();
        Task<RoomRes> GetRoomReservationByIdAsync(int id);
        Task<RoomRes> CreateRoomReservationAsync(RoomRes roomRes);
        Task UpdateRoomReservationAsync(RoomRes roomRes);
        Task DeleteRoomReservationAsync(int id);
        Task GetAllRoomReservations();
    }
}
